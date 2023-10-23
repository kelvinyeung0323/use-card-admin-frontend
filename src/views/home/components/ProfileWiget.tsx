import {useAuthContext} from "@/store/auth-context.tsx";
import {Avatar, Dropdown, MenuProps} from "antd";
import { UserOutlined,ExportOutlined} from "@ant-design/icons";
import React from "react";
import {Link} from "react-router-dom";


type ProfileWidgetProps ={
    style:React.CSSProperties
}
const ProfileWidget = ({style}:ProfileWidgetProps) => {

    const {logout} = useAuthContext()

    const items: MenuProps['items'] = [
        {
            label: (<Link to="my-profile">个人中心</Link>),
            key: '1',
            icon: <UserOutlined />,
        },
        {
            label: (<a onClick={logout}>退出</a>),
            key: '2',
            icon: <ExportOutlined />,
        },
    ]

    return (
        <>
            <div style={style}>
                <Dropdown menu={{ items }} placement="bottom" arrow>
                    <Avatar size={40}
                            style={{backgroundColor: '#87d068'}}
                            icon={<UserOutlined/>}/>
                    {/*{curUser?.nickName}*/}
                </Dropdown>

            </div>
        </>

    )

}

export default ProfileWidget