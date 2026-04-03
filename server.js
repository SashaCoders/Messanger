const http = require('http');
const fs = require('fs');
const path = require('path');


const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const style = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const indexJSFile = fs.readFileSync(path.join(__dirname, 'static', 'index.js'));

const server = http.createServer((req, res) => {
   switch (req.url){
       case '/': return res.end(indexHtmlFile);
       case '/style.css': return res.end(style);
       case '/index.js': return res.end(indexJSFile);
   }
    res.statusCode = 404;
    return res.end('Not Found');
});

server.listen(3000);

const {Server} = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {


    console.log('a user connected. id - ' + socket.id);
socket.on('new_message', (message) => {
    io.emit('message', message);
});
});

