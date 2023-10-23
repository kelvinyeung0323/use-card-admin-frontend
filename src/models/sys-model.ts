


export interface  IPageable {
    pageNum:number
    pageSize:number
}
export interface ISortable{
    sorts:string[]
}
export enum ResType{
    Catalog,
    Menu,
    Button
}
export type Res = {
    resId: string,
    parentId: string,
    resType? : ResType,
    icon?: string,
    resName: string,
    sort?:number|null,
    url?: string,
    urlParams?:string,
    enabled?:boolean,
    visible?:boolean,
    component?:string,
    authCode?:string,
    createdAt?:string,
    updatedAt?:string,
    children?:Res[]
}

export type ResQueryForm = ISortable & {
    resType:string|null,
    resName:string|null,
}
export  type RoleUserQueryForm = IPageable &{
    isBelongToRole:boolean //IsBelongToRole标识，为true表示查询属于角色的用户，false 表示查询不属于角色的用户
    roleId?:string
    userName?:string|null
    enabled?:boolean|null
    startAt?:number
    endAt?:number
}
export type Role ={
    roleId?:string,
    roleName:string,
    authCode:string,
    enabled?:boolean,
    createdAt?:string,
    resIds?:string[]
}

export type RoleQueryForm = IPageable &{
    roleName?:string|null
    authCode?:string|null
    enabled?:boolean|null
    startAt?:number|null
    endAt?:number|null
    sort?:string[]|null
}
export type User ={
    userId:string,
    userName:string,
    password?:string,
    nickName:string,
    enabled?:boolean
    createdAt?:string,
    updatedAt?:string,
    lastLoginAt?:string,
    roles?:Role[],
    roleIds:string[]
    res?:Res[]
    permissions?:string[]
    remark?:string,
}

export  type UserQueryForm = IPageable &{
    userName?:string|null
    enabled?:boolean|null
    startAt?:number|null
    endAt?:number|null
}


export type AreaItem ={
     value :string
    label:string
    children?:AreaItem[]
    disabled?:boolean
}


export type LoginForm ={
    username:string
    password:string
}