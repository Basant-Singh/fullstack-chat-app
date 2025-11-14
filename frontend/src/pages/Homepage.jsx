import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../Store/useAuthStore";
import { useMessageStore } from "../Store/useMessageStore";
import {useNavigate} from 'react-router';


const Homepage = ()=>{

    const {selectedUser} = useMessageStore();
    const {socket} = useAuthStore();
    const navigate = useNavigate();
    

   if(!socket) return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20 bg-base-100">
        <h1 className="text-5xl font-bold mb-4">
          Connect Instantly with <span className="text-primary">ChatApp</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl">
          A simple, secure, and real-time chat app to stay in touch with your friends and communities.
        </p>
        <div className="flex gap-4">
          <button className="btn btn-primary"
          onClick={()=> navigate("/signup")}
          >Sign Up</button>
        </div>
      </section>
    </div>
  );

    return (
    <div className="min-h-full grow bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center xl:px-4 xl:pt-10">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;