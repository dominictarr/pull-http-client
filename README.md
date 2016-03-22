# pull-http-client

make http client requests in pull streamy ways.

# api

http is a pretty ugly protocol. it has many features.
`pull-http-client` starts with the most general interface to http for pull-streams,
and then gives you several helpers that are each more suited to particular ways http is often used.

## request(opts, cb(err, source)) => sink

The most basic format. returns a sink stream, and takes a callback which will be called with an error, and a source stream.

## request.source(opts, cb (err)) => source

use for downloads. the source is the response.

## request.sink(opts, cb(err, data)) => sink

use for uploads. the sink will pull your uploads to the server.
`data` will contain the headers

## request.duplex(opts, cb(err, data)) => duplex

You probably won't need this. If you seem to need this, you should probably use websockets instead.
Some proxies will make this not work properly, but node<->node this should work.

## request.async(opts, cb(err, data))

sometimes http is just a question and an answer. for smallish/fixed size responses
don't use streams at all. just ask a question and get an answer.

## License

MIT

