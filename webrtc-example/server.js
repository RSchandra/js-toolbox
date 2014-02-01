function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}

var express = require("express");
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , WebSocketServer = require('websocket').server;

//set ipaddress from openshift, to command line or to localhost:8080
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;
server.listen(port, ipaddr);

app.get('/', function(req, res){ 
    res.redirect("/index.html");
}); 

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

var clients = [];
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    console.log(' Connection ' + connection.remoteAddress);
    clients.push(connection);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log((new Date()) + ' Received Message ' + message.utf8Data);
            // broadcast message to all connected clients
            clients.forEach(function (outputConnection) {
                if (outputConnection != connection) {
                  outputConnection.send(message.utf8Data, sendCallback);
                }
            });
        }
    });
    connection.on('close', function(connection) {
        // close user connection
        console.log((new Date()) + " Peer disconnected.");
    });
});

