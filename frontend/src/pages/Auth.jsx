import AuthForm from "../components/AuthForm";
import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "../Store/useAuthStore";



const Auth = ()=>{
    
    const {authUser} = useAuthStore();

    const path = useLocation().pathname.slice(1);
    
    if(authUser){
        return (
         <Navigate to={"/"} />
        )
    }

    return(
        <>
            <div>
                <AuthForm page={path}/>
            </div>
        </>
    )
}

export default Auth;