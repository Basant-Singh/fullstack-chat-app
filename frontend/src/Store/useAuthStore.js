import {create} from 'zustand';
import {toast} from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get)=>({
    authUser: null,
    isCheckingAuth: true,
    isAuthenticating: false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket: null,

    checkAuth: async ()=>{
        try {
            const resp = await axiosInstance.get('/auth/check');
            set({authUser: resp.data});
            get().connectSocket();
        } catch (error) {
            console.log(error);
        } finally{
            set({isCheckingAuth: false});
        }
    },
    authHandler: async (page, formData)=>{
        set({isAuthenticating:true})
        try {
            const authUrl = `/auth/${page}`;
            const toastMessage = page.toLowerCase() === "login" ? "Login Successful!!" : "User Registered Successfully!!";
            const resp = await axiosInstance.post(authUrl,formData);
            set({authUser: resp.data});
            toast.success(toastMessage);
            get().connectSocket();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally{
            set({isAuthenticating:false});
        }
    },
    logout: async()=>{
        set({isCheckingAuth: true})
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out Successfully!");
            set({authUser:null})
            get().disconnectSocket();
            
        } catch (error) {
            console.log(`Error in Logout: ${error}`);
            toast.error("Error Logging out");
        }finally{
            set({isCheckingAuth: false})
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const resp = await axiosInstance.post("/auth/update-profile",data);
            set({authUser: resp.data});
            toast.success("Profile Photo Updated!");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket: ()=>{
        const {authUser, socket: existingSocket} = get();

        if(!authUser || existingSocket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                id: authUser._id,
            } 
        });
        socket.connect();
        set({socket});

        socket.on("getOnlineUsers",(onlineUsers)=>{
            set({onlineUsers}); 
        })
    },
    disconnectSocket: ()=>{
        const {socket} = get();
        if(socket?.connected) socket.disconnect();
        set({socket: null});
    },
    
}))