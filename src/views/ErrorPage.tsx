import {useRouteError} from "react-router-dom";

import {Button, Result} from "antd";
import {ResultStatusType} from "antd/es/result";
import {useAuthContext} from "@/store/auth-context.tsx";
interface Error {
    status:number
    statusText:string,
    message:string
}

export default function ErrorPage() {

    const error=  useRouteError() as Error;
    console.error(error);
    const statusCode = error.status||500

    const {res} = useAuthContext()
    const getBack = ()=>{
        if(res.length<=0){
            location.href="/#/login"
        }else{
            window.history.back()
        }
    }

    return (
        <>
            <div style={{height:"100vh",justifyContent:"center",alignItems:"center",display:"flex"}}>
            <Result
                status={statusCode as ResultStatusType}
                title={statusCode}
                subTitle={error?.statusText || error.message}
                extra={<Button onClick={getBack} type="primary">返回</Button>}
            />
            </div>
        </>

    );
}