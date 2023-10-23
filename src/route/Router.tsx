import {createHashRouter, RouteObject, RouterProvider} from "react-router-dom";
import ErrorPage from "../views/ErrorPage.tsx";
import LoginPage from "../views/LoginPage.tsx";
import React, {LazyExoticComponent, Suspense, useEffect, useState} from "react";
import {Res, ResType} from "@/models/sys-model.ts";
import {useAuthContext} from "@/store/auth-context.tsx";
import {Skeleton} from "antd";
import {getCachedRouterConfig} from "@/common/auth.ts";

//1.从服务器获取菜单信息，并保存到state
//2.把菜单信息转为路由配置


const lazyLoadCoponent = (componentUrl: string) => {
    const viteModule = import.meta.glob("@/views/**/**.tsx")

    const url = "/src" + componentUrl
    const module = viteModule[url]

    let DynamicComponent: LazyExoticComponent<any> | null = null
    if (module != undefined) {
        DynamicComponent = React.lazy(module as never)
    } else {
        console.error("路由模块加载错误,url:", url, "module:undefined")
    }

    return DynamicComponent == null ? (
        <>
            <div><h3>Component not found</h3></div>
        </>
    ) : (
        <>
            <Suspense fallback={<Skeleton active/>}>
                <DynamicComponent/>
            </Suspense>
        </>
    )
}


const resToRoutes = (res: Res[]): RouteObject[] => {
    const routeObjs: RouteObject[] = []
    res.forEach(res => {
        if (res.resType == ResType.Menu) {
            routeObjs.push({path: res.url, element: lazyLoadCoponent(res.component as string)})
        }
        if (res.children) {
            const children = resToRoutes(res.children)
            routeObjs.push(...children)
        }

    })

    return routeObjs

}


export const loadRoutes = (res: Res[] | null): RouteObject[] => {
    if (res == null){
        return []
    }
    return [{
        path: '/',
        element: lazyLoadCoponent('/views/AppLayout.tsx'),
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '/',
                element: lazyLoadCoponent('/views/home/Home.tsx'),
            },
            {
                path: '/my-profile',
                element: lazyLoadCoponent('/views/home/MyProfile.tsx'),
            },
            ...resToRoutes(res)
        ]
    }, {
        path: 'login',
        element: <LoginPage/>
    }]
}


export default function KRouterProvider() {

    const {res} = useAuthContext()
    useEffect(() => {
        const router = createHashRouter(loadRoutes(res))
        setRouter(router)
    }, [res]);
    const [router, setRouter] = useState(createHashRouter(loadRoutes(getCachedRouterConfig())))

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )

}
