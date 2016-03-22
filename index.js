var http = require('http')
var defer = require('pull-defer')
var pull = require('pull-stream')
var toPull = require('stream-to-pull-stream')
var URL = require('url')

//pull stream that ends immediately.
function empty (_, cb) { cb(true) }

var request = exports = module.exports = function (opts, cb) {
  if(opts.url) {
    var _opts = URL.parse(opts.url)
    for(var k in _opts)
      opts[k] = _opts[k]
  }
  var done = null
  return toPull.sink(
    http.request(opts)
    .on('response', function (response) {
      if(done) return
      done = true
      var source = toPull.source(response)
      source.headers = response.headers
      source.url = response.url
      source.status = response.status
      cb(null, source)
    })
    .on('error', function (err) {
      if(done) return
      done = true
      cb(err)
    })
  )
}

exports.duplex = function (opts, cb) {
  var source = defer.source()
  return {
    source: source,
    sink: request(opts, function (err, _source) {
      if(err) {
        source.resolve(pull.error(err))
        cb && cb(err)
      }
      else
        source.resolve(_source)
    })
  }
}

exports.source = function (opts) {
  return pull(empty, exports.duplex(opts))
}

exports.sink = function (opts, cb) {
  return pull(request(opts, function (err, source) {
    if(err) return cb(err)
    pull(source, pull.collect(function (err, ary) {
      if(err) cb(err)
      else {
        var body = Buffer.concat(ary)
        if(opts.json) {
          try {
            body = JSON.parse(body.toString())
          } catch (err) {
            return cb(err)
          }
          return cb(null, body)
        }
        cb(null, body)
      }
    }))
  }))
}

exports.async = function (opts, cb) {
  //if cb is not provided, turn into a continuable.
  if(!cb) return function (cb) { exports.async(opts, cb) }

  pull(empty, exports.sink(opts, cb))
}

