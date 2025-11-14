import { Image, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMessageStore} from "../Store/useMessageStore";

const MessageInput = ()=>{

    const fileInputRef = useRef(null);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const {sendMessage, isSendingMessage} = useMessageStore();

    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text,
                image: imagePreview
            });
            setText("");
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            toast.error("Error sending message", error.message)
        }

    }
    

    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return
        }
        
        const fileReader = new FileReader();
        fileReader.onloadend = ()=>{
            setImagePreview(fileReader.result);
        }
        fileReader.readAsDataURL(file);

    }

    const removeImage = ()=>{
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div className="p-4 w-full">
      
      {
        imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )
      }

      <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSendingMessage}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isSendingMessage}
          />

          <button
            type="button"
            className="flex btn btn-circle text-emerald-500"
            onClick={()=> fileInputRef?.current.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={isSendingMessage || (!text.trim() && !imagePreview)}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
    )
}

export default MessageInput;