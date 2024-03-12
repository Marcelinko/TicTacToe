import express from 'express';
import { createServer } from 'http'
import {Server} from 'socket.io';

import { handler } from '../build/handler.js';

import roomHandler from "./api/handlers/roomHandler.js";
import tictactoeHandler from "./api/handlers/tictactoeHandler.js";

const port = 3000;
const app = express();
const server = createServer(app)

const io = new Server(server);

io.listen(server);

app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

const onConnection = (socket) => {
	roomHandler(io, socket);
	tictactoeHandler(io, socket);
	console.log(`User ${socket.id} connected`);
	socket.on("disconnect", () => {
		console.log(`User ${socket.id} disconnected`);
	});
}

io.on("connection", onConnection);
app.use(handler);

server.listen(port, () => {
	console.log(`Server is running`);
});


