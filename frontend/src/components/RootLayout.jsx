import { Outlet } from "react-router";
import Navbar from "./Navbar";

const RootLayout = ()=>{
    return(
        <div className="min-h-screen overflow-auto flex flex-col">
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default RootLayout;