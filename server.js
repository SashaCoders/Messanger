const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./database');
const cookie = require('cookie');

const  validAuthToken = [];

const indexHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'index.html'));
const registerHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'register.html'));
const style = fs.readFileSync(path.join(__dirname, 'static', 'style.css'));
const indexJSFile = fs.readFileSync(path.join(__dirname, 'static', 'index.js'));
const authJSFile = fs.readFileSync(path.join(__dirname, 'static', 'auth.js'));
const loginHtmlFile = fs.readFileSync(path.join(__dirname, 'static', 'login.html'));

const server = http.createServer((req, res) => {
   switch (req.url){
       case '/': return res.end(indexHtmlFile);
       case '/register': return res.end(registerHtmlFile);
       case '/login': return res.end(loginHtmlFile);
       case '/style.css': return res.end(style);
       case '/index.js': return res.end(indexJSFile);
       case '/auth.js': return res.end(authJSFile);
       default: return quarded(res, req);
   }
   if (req.method === 'POST'){
        switch (req.url){
            case '/api/register': return registerUser(req,res);
            case '/api/login': return login(res,req);
            default: return quarded(res, req);
        }
    }
});



function quarded (req, res) {
    const credentionals = getCredentionals(req);

    if (!credentionals) {
        res.writeHead(302, {Location: '/register'});
        return res.end();
    }

    if (req.method === 'GET') {
        switch (req.url) {
            case '/': return res.end(indexHtmlFile);
            case '/script.js': return res.end(scriptFile);
        }
    }
    res.writeHead(404);
    return res.end('Error 404');
}

function getCredentionals (req) {
    const cookie = cookie.parse(req.headers?.cookie || '');
    const token = cookie?.token;
    if (!token || !validAuthToken.includes(token)) return null;
    const [user_id, login] = token.split('.');
    if (!user_id || !login) return null;
    return {user_id, login};
}

function login(res, req){
    let data = '';
    req.on('data', function (chunk){
        data += chunk;
    });
    req.on('end', async  function(){
        try{
           const user = JSON.parse(data);
           const token = await db.getAuthToken(user);
           validAuthToken.push(token);
           res.writeHead(200);
           res.end(token);
        } catch (e) {
            res.writeHead(500);
            return res.end('Error: ' + e);
        }
    });
}

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

