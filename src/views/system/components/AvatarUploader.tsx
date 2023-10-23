import {message, Upload} from "antd";
import {getToken} from "@/common/auth.ts";
import {RcFile, UploadChangeParam, UploadProps} from "antd/es/upload";
import {UploadFile} from "antd/es/upload/interface";
import {Result} from "@/common/http.ts";
import {UploadedFile} from "@/common/file-helper.ts";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import { useState} from "react";


type AvatarUploaderProps = {
    value?:string,
    onChange?:(value:string)=>void
}
export const AvatarUploader=({value,onChange}:AvatarUploaderProps)=>{
    const [avatarUrl,setAvatarUrl] =useState<string|undefined>(value)
    const [uploading,setUploading] = useState<boolean>(false)


    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };



    const uploadButton = (
        <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile<Result<UploadedFile>>>) => {
        console.log("upload change",info)
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            const res = info.file.response;
            if(res?.code == 200){
                setAvatarUrl(res.data.url)
                if(onChange){
                    console.log("avatarUrl",avatarUrl)
                    onChange(res.data.url as string)
                }
            }else {
                message.error("上传失败")
            }

        }
    };
    return(
        <>
            <Upload
                name="file"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                headers={{Authorization:"Bearer "+getToken()}}
                action={import.meta.env.VITE_APP_BASE_API+"/api/admin/svc/file-upload"}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        </>
    )
}


