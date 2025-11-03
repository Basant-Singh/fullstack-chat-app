import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getContacts = async (req, res)=>{

    try {
        const {_id: myId} = req.user;
    
        const filteredUsers = await User.find({_id: {$ne: myId} }).select("-password");
    
        res.json(filteredUsers);
        
    } catch (error) {
        console.log(`Error in Get Contacts Controller`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}
export const getMessages = async (req,res)=>{
    try {
        const {id: chatUserId} = req.params;
        const {_id: myId} = req.user;

        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: chatUserId},
                {senderId: chatUserId, receiverId: myId},
            ]
        })

        res.json(messages);

    } catch (error) {
        console.log(`Error in Get Message Controller`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const sendMessage = async (req,res)=>{
    try {
        const {id: receiverId} = req.params;
        const {_id: senderId} = req.user;
        const {text, image} = req.body;

        let imageUrl = null;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const message = await new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await message.save();
        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",message); 
        }

        res.json(message); 



    } catch (error) {
        console.log(`Error in Send Message Controller`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}