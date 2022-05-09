const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const colors = require('colors');
const helpers = require('./helpers');
const ejs = require('ejs');

const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.removeListener(helpers.view('index.html'))  
});

io.on('connection', (socket) => {

    console.log(colors.rainbow('Nuevo usuario conectado'));

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })

});

server.listen(3000, () => {
  console.log(colors.green('Server running on port 3000'));
});