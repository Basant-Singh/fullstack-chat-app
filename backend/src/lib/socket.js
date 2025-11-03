import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';

const app = express();

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials: true,
    }
});

const socketUserMap = {};

export const getReceiverSocketId = (receiverUserId)=>{
    return socketUserMap[receiverUserId];
}

io.on("connection",(socket)=>{

    const userId = socket.handshake.query?.id;

    if(userId){
        socketUserMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(socketUserMap)); 
    
    socket.on("newMessage",(data)=>{
        io.emit("newMessage",data);
    })
    
    
    socket.on("disconnect",()=>{
        delete socketUserMap[userId];
        io.emit("getOnlineUsers",Object.keys(socketUserMap));  
         
    })
})


export {server, app, io};