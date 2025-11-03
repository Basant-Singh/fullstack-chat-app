import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useMessageStore = create((set,get)=>({
    messages:[],
    users: [],
    selectedUser: null,

    getUsers: async ()=>{
        try {
            const users = await axiosInstance.get('/message/users');
            set({users: users.data});
        } catch (error) {
            console.log(error.message)
        }
    },
    setSelectedUser: (userId)=>{
        set({selectedUser: userId});
        const {getMessages, selectedUser} = get();
        getMessages(selectedUser?._id);
    },
    getMessages: async ()=>{
        const {selectedUser} = get();
        try {
            if(selectedUser){
                const response = await axiosInstance.get(`/message/${selectedUser?._id}`);
                set({messages: response.data});
            }
        } catch (error) {
            console.log(error.message)
        }
    },
    sendMessage: async (payload)=>{
        try {
            const {selectedUser,messages} = get();
            const url = `/message/send/${selectedUser._id}`;
            const resp = await axiosInstance.post(url,payload);
            set({messages: [...messages, resp.data]});

        } catch (error) {
            console.log(error.message)
        }
    },
    subscribeToMessages: ()=> {
        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage",(message)=>{
            const selectedUser = get().selectedUser;
            if(message.senderId !== selectedUser) return;
            set({messages: [...get().messages, message]});
        })
    },
    unsubscribeFromMessages: ()=>{

        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}))