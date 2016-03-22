
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
    var url = URL.format({
        protocol:'http',
        hostname: 'localhost',
        port: server.address().port,
        pathname: '/foo/bar/baz',
        search: '?whatever=true'
      })
    client.async({url: url, json: true}, function (err, body) {
      console.log(  'RES', err, body)
      t.notOk(err)
      t.ok(body)
      t.end()
      server.close()
    })
  })
})





