import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useMessageStore = create((set,get)=>({
    messages:[],
    users: [],
    selectedUser: null,
    isChatLoading: false,
    isUserLoading: false,
    isSendingMessage: false,

    getUsers: async ()=>{
        try {
            set({isUserLoading: true});
            const users = await axiosInstance.get('/message/users');
            set({users: users.data});
        } catch (error) {
            console.log(error.message)
        } finally{
            set({isUserLoading: false})
        }
    },
    setSelectedUser: (user)=>{
        set({selectedUser: user});
        const {getMessages, selectedUser} = get();
        getMessages(selectedUser?._id);
    },
    getMessages: async ()=>{
        const {selectedUser} = get();
        try {
            set({isChatLoading : true});
            if(selectedUser){
                const response = await axiosInstance.get(`/message/${selectedUser?._id}`);
                set({messages: response.data});
            }
        } catch (error) {
            console.log(error.message)
        } finally{
            set({isChatLoading: false})
        }
    },
    sendMessage: async (payload)=>{
        try {
            set({isSendingMessage: true});
            const {selectedUser,messages} = get();
            const url = `/message/send/${selectedUser._id}`;
            const resp = await axiosInstance.post(url,payload);
            set({messages: [...messages, resp.data]});

        } catch (error) {
            console.log(error.message)
        } finally {
            set({isSendingMessage: false});
        }
    },
    subscribeToMessages: ()=> {
        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage",(message)=>{
            const selectedUser = get().selectedUser;
            if(message.senderId !== selectedUser._id) return;
            set({messages: [...get().messages, message]});
        })
    },
    unsubscribeFromMessages: ()=>{

        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}))