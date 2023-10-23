import {LoginForm, User} from "@/models/sys-model.ts";
import request, {Result} from "@/common/http.ts";
import {AUTH_PREFIX, SVC_PREFIX} from "@/service/contraints.ts";





export  function login(form :LoginForm):Promise<Result<{token:string}>>{
    return request.post(`${AUTH_PREFIX}/login`,form)
}


export  function currentUser():Promise<Result<User>>{
    return request.get(`${SVC_PREFIX}/profile/current-user`)
}


export  function changePwd(oldPassword:string,newPassword:string):Promise<Result<never>>{
    console.log("post data:",oldPassword,newPassword)
    return request.post(`${SVC_PREFIX}/profile/change-password`,{"oldPassword":oldPassword,"newPassword":newPassword})
}


export  function updateProfile(user:User):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/profile/update-profile`,user)
}