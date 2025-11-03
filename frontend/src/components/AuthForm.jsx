import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare, User } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";

const AuthForm = ({page})=>{
    const {isAuthenticating, authHandler} = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    })

    function validateForm(){
        if(pageTitle.toLowerCase() === "signup" && !formData.fullName.trim()) return toast.error("Full Name is required");
        if(!formData.email)  return toast.error("Email is required");
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Invalid email format");
        if(!formData.password)  return toast.error("Password is required");
        if(pageTitle.toLowerCase() === "signup" && formData.password.length<6) return toast.error("Password must be atleast 6 characters");

        return true
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const isFormValid = validateForm();
        isFormValid === true && authHandler(page, formData);
    }

    const pageTitle = `${page[0].toUpperCase()}${page.slice(1)}`;
    const actionText = page==="login" ? "Don't have an account? Signup" : "Already have an account? Login";

    return(
        <div className="hero h-[80vh]">
                    <div className="hero-content flex-col lg:flex-row w-full justify-evenly">
                        <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">{pageTitle} now!</h1>
                        </div>
                        <div className="card bg-base-100 w-full max-w-sm shrink-0  flex justify-center">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset className="fieldset">
                                        { page==="signup" && <div>
                                        <label className="label" htmlFor="fullName">Full Name</label>
                                        <div className="input" >
                                            <User className="size-4"/>
                                        <input placeholder="John Doe" 
                                        value={formData.fullName}
                                        onChange={(e)=> setFormData({...formData, fullName: e.target.value})}
                                        name="fullName" id="fullName"/>
                                        </div>
                                        </div>}
                                        <label className="label" htmlFor="email">Email</label>
                                        <div className="input">
                                        <Mail className="size-4"/>
                                        <input type="email" placeholder="johndoe@xyz.com" 
                                        value={formData.email}
                                        onChange={(e)=> setFormData({...formData, email: e.target.value})}
                                        id="email" name="email"/>
                                        </div>
                                        <label className="label" htmlFor="password">Password</label>
                                        <div className="input">
                                        <Lock className="size-4"/>
                                        <input type={showPassword ? "text": "password"} placeholder="•••••••" 
                                        value={formData.password}
                                        onChange={(e)=> setFormData({...formData, password: e.target.value})}
                                        id="password" name="password"/>
                                        {
                                            showPassword ? 
                                            <EyeOff className="size-4 cursor-pointer" onClick={()=> setShowPassword(prev => !prev)}/>
                                            :
                                            <Eye className="size-4 cursor-pointer" onClick={()=> setShowPassword(prev => !prev)}/>
                                        }
                                        </div>
                                        { page==="login" && <div><a className="link link-hover">Forgot password?</a></div>}
                                        {
                                            isAuthenticating ? 
                                            <button className="btn btn-primary mt-4 btn-disabled" type="submit"><Loader2 className="animate-spin"/>{pageTitle.toLowerCase() === "login"? "Logging In": "Signing Up"}</button>
                                            :
                                            <button className="btn btn-primary mt-4" type="submit">{pageTitle}</button>
                                        }
                                    </fieldset>
                                </form>
                            </div>
                            <div className="self-center mb-4"><Link to={page==="login"? "/signup": "/login"} className="link link-hover">{actionText}</Link></div>
                        </div>
                    </div>
                </div>
    )
}

export default AuthForm;