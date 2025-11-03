import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../Store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";


const Navbar = ()=>{

    const {logout, authUser} = useAuthStore();
    const navigate = useNavigate();
    const path = useLocation().pathname.slice(1);

    const handleLogoutClick = async ()=>{
        if(authUser){
            await logout();
        }
        navigate("/login");
    }

    const handleProfileClick = ()=>{
        navigate("/profile");
    }
    
    const handleSettingClick = ()=>{
        navigate("/settings");
    }

    return(
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <Link className="btn btn-ghost text-xl" to="/"><MessageSquare className="size-6"/>ChatApp</Link>
                </div>
                <div className="flex justify-end navbar-end">
                    <button className="btn rounded-xl ml-2" onClick={handleSettingClick}>
                        <Settings className="size-4"/>
                        Settings</button>
                    {    authUser &&
                    <button className="btn rounded-xl ml-2" onClick={handleProfileClick}>
                        <User className="size-4"/>
                        Profile</button>}
                    {
                        (path !== "login" && path !== "signup") &&
                            <button className="btn rounded-xl ml-2" onClick={handleLogoutClick}>
                                <LogOut className="size-4"/>
                            {authUser? "Logout": "Sign in"}</button>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar;