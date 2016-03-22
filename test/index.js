
var tape = require('tape')

var muxhttp = require('../')
var http = require('http')
var URL = require('url')
var pull = require('pull-stream')

var client = require('../')

tape('simple', function (t) {

  var server = http.createServer(function (req, res) {
    console.log(req.method, req.url)
    res.end(JSON.stringify({url: req.url, status: req.status, headers: req.headers}))
  })
  .listen(function () {
    console.log('server', server.address())
    var url = URL.format({
        protocol:'http',
        hostname: 'localhost',
        port: server.address().port,
        pathname: '/foo/bar/baz',
        search: '?whatever=true'
      })

//    http.request(url, function (err) {if(err) throw err}).end()

    client.async({url: url, json: true}, function (err, body) {
      console.log(  'RES', err, body)
      t.end()
      server.close()
    })

//    pull(function (_,cb){cb(true)}, client(url, function (err, source) {
//      console.log('res', err)
//      pull(source, pull.collect(console.log))
//    }))
  })
})


