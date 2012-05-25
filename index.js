var net = require('net');


function scan(port, opts, accum) {
  if (!port) port = 1;
  if (accum == undefined) accum = 0;
  if (!opts) opts = {};
  if (opts.startPort == undefined) opts.startPort = port;
  if (!(opts.maxPort)) opts.maxPort = 65537; //exclusionary
  if (!(opts.host)) opts.host = 'localhost';
  if (opts.findActive == undefined) opts.findActive = true;
  if (opts.findOne == undefined) opts.findOne = false;
  if (!(opts.success)) opts.success = function(host, port) {
  } 
  if (!(opts.failure)) opts.failure = function(host, port) {
  }
  if (!(opts.complete)) opts.complete = function() {
  }

  function handleResponse(active, port, opts) {
    var success = (opts.findActive === active);

    if (success) {
      accum++;
      opts.success(opts.host, port);
    } else {
      opts.failure(opts.host, port);
    }

    if ((!success || (success && !(opts.findOne))) && port < opts.maxPort) {
      return scan(++port, opts, accum);
    } else {
      return opts.complete({
        count: (port - opts.startPort),
        successes: accum,
        failures: (((opts.maxPort > opts.startPort)?(opts.maxPort):opts.startPort+1)-opts.startPort-accum)
      });
    }
  }
  
  var _socket = new net.Socket();
  var handled = false;
  _socket.setTimeout(3000);
  _socket.on('error', function() {
    handled = true;
    handleResponse(false, port, opts);
  });
  _socket.on('end', function() {
    if (!handled) {
      handleResponse(false, port, opts);
    }
  });
  _socket.connect(port, opts.host, function() {
    handled = true;
    _socket.end();
    handleResponse(true, port, opts);
  });
}

module.exports = scan;
