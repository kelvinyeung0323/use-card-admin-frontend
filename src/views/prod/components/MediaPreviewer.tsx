import {Image} from "antd"
import {ItemMedia} from "@/models/item-model.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {TransformType} from "rc-image/lib/hooks/useImageTransform";
import {videoSnapshot} from "@/common/video-helper.ts";
import {MediaType} from "@/models/item-spec-model.ts";


type MediaPreviewerProps = {
    medias: ItemMedia[]
}
const MediaPreviewer = ({medias}: MediaPreviewerProps) => {


    const [items, setItems] = useState<string[]>([])
    const [coverUrl,setCoverUrl] = useState<string>("")
    useEffect(() => {
        console.log(medias)
        setAlbumCover(medias)
        setItems(medias?.map(e => e.location))
    }, [medias]);
    const renderMedia = (originalNode: React.ReactElement, info: {
        transform: TransformType;
        current: number;
    }) => {
        const curMedia = medias[info.current]
        if (curMedia.mediaType == MediaType.image) {
            return originalNode
        }
        return (
            <>
                <video src={curMedia?.location}  height={600} playsInline preload="auto" controls={true}/>
            </>
        )
    }

    const setAlbumCover = (mediaList:ItemMedia[])=>{
        if(mediaList&&mediaList.length>0){
           const cover = mediaList[0];
            if(cover.mediaType ==MediaType.video){
                videoSnapshot({url:cover.location,progress:1}).then((snapshot)=>{
                    setCoverUrl(snapshot.base64)
                })
            }else{
                setCoverUrl(cover.location)
            }
        }

    }
    return (
        <>
            <Image.PreviewGroup
                items={items}
                preview={{imageRender: renderMedia}}

            >
                <Image style={{objectFit:"cover"}} width={80} height={80} src={coverUrl}/>
            </Image.PreviewGroup>
        </>
    )
}
export default MediaPreviewer