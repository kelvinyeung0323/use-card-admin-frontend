
//权限拦截
import {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {isLoggedIn} from "@/common/auth.ts";

interface AppAuthProps {
    children: ReactNode | ReactNode[]
}

const AppAuth = ({children}: AppAuthProps) => {

    const loc = useLocation()
    console.log("location", loc)

    return isLoggedIn() ? children : <Navigate to="/login"/>;
}
export default AppAuth