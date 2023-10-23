import React, {createContext, useContext, useState} from "react";
import {LoginForm, Res, User} from "@/models/sys-model.ts";

import * as authService from "@/service/auth-service.ts"
import {
    cacheRouterConfig,
    clearCachedRouterConfig,
    clearToken,
    isLoggedIn,
    setToken as setTokenToLocalStorage
} from "@/common/auth.ts";
import {Spin} from "antd";


type AuthContextType = {
    isAuthLoaded: boolean
    curUser: User | null
    setCurUser: React.Dispatch<React.SetStateAction<User | null>>
    token: string
    setToken: React.Dispatch<React.SetStateAction<string>>
    res: Res[]
    setRes: React.Dispatch<React.SetStateAction<Res[]>>
    permissions: string[]
    setPermissions: React.Dispatch<React.SetStateAction<string[]>>
    loadAuthInfo: () => void
    logout: () => void
    login: (form: LoginForm) => Promise<string>
    hasPerm: (authCode: string) => boolean,
}

export const AuthContext = createContext<AuthContextType | null>(null)


type AuthContextProviderProps = {
    children: React.ReactNode;
}

export default function AuthContextProvider({children}: AuthContextProviderProps) {
    const [needCheck, setNeedCheck] = useState(true)
    const [isAuthLoaded, setIsAuthLoaded] = useState(false)
    const [curUser, setCurUser] = useState<User | null>(null)
    const [token, setToken] = useState<string>("")
    const [res, setRes] = useState<Res[]>([])
    const [permissions, setPermissions] = useState<string[]>([])

    //加载当前用户、加载当前权限、加载资源
    function loadAuthInfo() {

        authService.currentUser().then(resp => {
            if (resp.data) {
                const user = resp.data
                setCurUser(user)
                if (user.res) {
                    setRes(user.res)
                    cacheRouterConfig(user.res)
                }
                if (user.permissions) {
                    setPermissions(user.permissions)
                }

            }
            setIsAuthLoaded(true)
            setNeedCheck(true)
        }).catch((reason) => {
            console.log("reason:", reason)
            setNeedCheck(false)
        })

    }

    //权限验证
    const hasPerm = (authCode: string): boolean => {
        if (curUser?.userName === "admin") return true
        return permissions.includes(authCode)
    }
    const login = (form: LoginForm):Promise<string> => {
     return new Promise((resolve,reject)=>{
         authService.login(form).then((resp) => {

             const token = resp.data.token
             if (token) {
                 setTokenToLocalStorage(token)
                 //加载数据
                 loadAuthInfo()
                 location.href = "/#/"
                 resolve("登录成功")
             }
             reject("未知错误")
         }).catch((reason)=>{
          reject(reason)
        })

     })
    }


    const logout = () => {
        clearToken()
        clearCachedRouterConfig()
        location.href = "/#/login"
    }
    if (!isLoggedIn()) {
        logout()
    }

    if (needCheck && isLoggedIn() && !isAuthLoaded) {
        //加载数据
        loadAuthInfo()

        return (
            <>
                <div
                    style={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#ffffff"
                    }}>
                    <Spin spinning={true}></Spin>
                </div>
            </>
        )
    }


    return (
        <AuthContext.Provider
            value={{
                isAuthLoaded,
                curUser,
                setCurUser,
                token,
                setToken,
                res,
                setRes,
                permissions,
                setPermissions,
                loadAuthInfo,
                logout,
                login,
                hasPerm
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error(
            "useAuthContext must be used within a AuthContextProvider"
        );
    }
    return context
}
