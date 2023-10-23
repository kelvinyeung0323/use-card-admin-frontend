import {PlusOutlined} from '@ant-design/icons';
import {Modal, Upload} from 'antd';
import type {RcFile, UploadProps} from 'antd/es/upload';
import {UploadChangeParam} from "antd/es/upload";
import type {UploadFile} from 'antd/es/upload/interface';
import {useEffect, useState} from "react";
import {getToken} from "@/common/auth.ts";
import {Result} from "@/common/http.ts";
import {UploadedFile} from "@/common/file-helper.ts";
import {videoSnapshot} from "@/common/video-helper.ts";
import useForceUpdate from "antd/es/_util/hooks/useForceUpdate";
import {MediaType} from "@/models/item-spec-model.ts";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
export interface UploadedMedia {
    mediaId:string
    mediaType:MediaType
    location:string
}
type PicsUploaderProps = {
    action?:string
    value?: UploadedMedia[] | null
    onChange?: (val: UploadedMedia[]) => void
    onRemove?: (file: UploadFile<UploadedMedia>) => void | boolean | Promise<void | boolean>;
}

const toMediaType = (type: string): MediaType => {
    if (!type) {
        return MediaType.file
    } else if (type.startsWith("video")) {
        return MediaType.video
    } else if (type.startsWith("image")) {
        return MediaType.image
    } else {
        return MediaType.file
    }
}

const toUploadType = (mediaType?:MediaType,fileName?:string):string=>{
    let ext=""
    let type:MediaType=MediaType.image
    if(fileName){
       ext ="/"+fileName.substring(fileName.lastIndexOf(".")+1)
    }

    if(mediaType){
         type=mediaType
    }
    switch (type){
        case MediaType.image:
            return "image" +ext
        case MediaType.video:
            return "video"+ext
        case MediaType.file:
            return "file"+ext
        default:
            return "file"+ext
    }
}
export default function MediaUploader({value,action,onRemove, onChange}: PicsUploaderProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewType, setPreviewType] = useState<MediaType>(MediaType.image)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const  [actionUrl,setActionUrl] = useState("")
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        console.log("value change:",value)
        const v = value?.map((e) => {
            const file: UploadFile = {
                thumbUrl: "",
                status: "done",
                url: e.location,
                uid: e.mediaId as string,
                type:toUploadType(e.mediaType,e.location),
                name: e.mediaId as string
            };
            if (e.mediaType == MediaType.video) {
                videoSnapshot({url: e.location as string, progress: 1}).then(({base64}) => {
                        file.type = "video/mp4"
                        file.thumbUrl = base64;
                        forceUpdate()
                    }
                )
            }
            return file

        })

        if (v) {
            setFileList(v)
        } else {
            setFileList([])
        }
    }, [value]);

    useEffect(() => {
        if(action){
            setActionUrl(action)
        }else {
            setActionUrl(import.meta.env.VITE_APP_BASE_API + "/api/admin/svc/file-upload")
        }
    }, []);
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewType(toMediaType(file.type as string))
        setPreviewUrl(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };


    const handleChange: UploadProps['onChange'] = ({
                                                       file,
                                                       fileList
                                                   }: UploadChangeParam<UploadFile<Result<UploadedFile>>>) => {


        if (file.status == "done") {
            if (file.response?.code != 200) {
                file.status = "error"
            } else {
                file.url = file.response?.data.url
                file.uid = file.response?.data.id
            }
            if (file.type?.startsWith("video")) {
                videoSnapshot({url: file.url as string, progress: 1}).then(({base64}) => {
                        file.thumbUrl = base64;
                        forceUpdate()
                    }
                )
            }



        }
        setFileList(fileList);

        if(file.status !="uploading"){
            if (onChange) {

                const f = fileList.filter(e => e.status == "done" && e.url != undefined)
                    .map(e => ({
                        location: e.url,
                        mediaType: toMediaType(e.type as string)
                    }))
                console.log("change:::",f)
                onChange(f as UploadedMedia[])
            }
        }
    }



    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );
    return (
        <>
            <Upload
                onRemove={onRemove}
                name="file"
                headers={{Authorization: "Bearer " + getToken()}}
                action={actionUrl}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                {previewType == MediaType.video ?
                    <video src={previewUrl} width={500} playsInline preload="auto" controls={true}/>
                    : <img alt="example" style={{width: '100%'}} src={previewUrl}/>
                }
            </Modal>
        </>
    );
}
