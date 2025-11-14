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
                    <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <button className="btn mb-2" onClick={handleSettingClick}>
                        <Settings className="size-4"/>
                        Settings</button>
                        <li>
                        {
                            (path !== "login" && path !== "signup") &&
                            <button className="btn btn-error" onClick={handleLogoutClick}>
                                <LogOut className="size-4"/>
                            {authUser? "Logout": "Sign in"}</button>
                        }

                        </li>
                    </ul>
                    </div>
                    <Link className="btn btn-ghost text-xl" to="/"><MessageSquare className="size-6"/>ChatApp</Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                </div>
                <div className="navbar-end">
                    <button className="btn rounded-xl ml-2 hidden lg:flex" onClick={handleSettingClick}>
                        <Settings className="size-4"/>
                        Settings</button>
                    { authUser &&
                    <button className="btn rounded-xl ml-2" onClick={handleProfileClick}>
                        <User className="size-4"/>
                    Profile</button>}
                    {
                        (path !== "login" && path !== "signup") &&
                            <button className="btn rounded-xl ml-2 hidden lg:flex btn-error" onClick={handleLogoutClick}>
                                <LogOut className="size-4"/>
                            {authUser? "Logout": "Sign in"}</button>
                    }
                </div>
                </div>
        </>
    )
}

export default Navbar;