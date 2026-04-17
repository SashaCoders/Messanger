const http = require('http');
const fs = require('fs');
const path = require('path');


const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const registerHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'register.html'));
const style = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const indexJSFile = fs.readFileSync(path.join(__dirname, 'static', 'index.js'));
const authJSFile = fs.readFileSync(path.join(__dirname, 'static', 'auth.js'));

const server = http.createServer((req, res) => {
   switch (req.url){
       case '/': return res.end(indexHtmlFile);
       case '/register': return res.end(registerHtmlFile);
       case '/style.css': return res.end(style);
       case '/index.js': return res.end(indexJSFile);
       case '/auth.js': return res.end(authJSFile);
   }
   if (req.method === 'POST'){
        switch (req.url){
            case '/api/register': return registerUser(req,res);
        }

    }

    return res.end('Error 404');
});

function registerUser(req, res){
    let data = '';
    req.on('data', function (chunk){
        data += chunk;
    });
    req.on('end', async  function(){
        try{
            const user = JSON.parse(data);
            if (!user.login || !user.password){
                return res.end('Empty login or password');
            } if (await db.isUserExist(user.login)){
                return res.end('User already exist');
            }
            await db.addUser(user);
            return res.end('Registeration is successfull');
        }
        catch(e){return res.end('Error: ' + e);
        }
    });
}

server.listen(3000);

const {Server} = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {


    console.log('a user connected. id - ' + socket.id);
socket.on('new_message', (message) => {
    io.emit('message', message);
});
});

