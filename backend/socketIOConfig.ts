import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
const serverPort = parseInt(process.env.PORT || '8081');
const socketIOPort = parseInt(process.env.SOCKET_IO_PORT || '3000')

export const socketsConfig = () => {
    const httpServer = createServer();
    const socketIO = new Server(httpServer, {cors: {origin: `http://localhost:${serverPort}`, methods: ["GET", "POST"]}});
    socketIO.on("connection", (socket: Socket) => {
        console.log("user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
    httpServer.listen(socketIOPort);
    return socketIO
}
 
