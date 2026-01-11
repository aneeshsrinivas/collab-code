import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setupWebSocket(server: HttpServer) {
    const io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit('user-joined', socket.id);
        });

        socket.on('code-change', (data) => {
            socket.to(data.roomId).emit('code-update', data);
        });

        socket.on('cursor-move', (data) => {
            socket.to(data.roomId).emit('cursor-update', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
