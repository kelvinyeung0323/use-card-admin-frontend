import {Button, Col, Form, message, Popconfirm, Row, Space, Spin} from "antd";
import MediaUploader, {UploadedMedia} from "@/views/prod/components/MediaUploader.tsx";
import {PlusOutlined} from "@ant-design/icons";
import { useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as specService from "@/service/item-spec-service.ts"
import {ItemSpecColor, ItemSpecMedia, MediaCatlog} from "@/models/item-spec-model.ts";
import ItemSpecColorWidget, {WidgetMode} from "@/views/prod/components/ItemSpecColorWidget.tsx";
import {UploadFile} from "antd/es/upload/interface";



type MediaCatalogItemProps = {
    value?: ItemSpecColor,
    onSaveColor?: (val: ItemSpecColor) => void,
    onRemoveColor?:(colorId?:string)=>void,
    onDelete?: () => void,
    widgetMode?:WidgetMode
}
const MediaCatalogItem = ({value,widgetMode,onRemoveColor, onSaveColor}: MediaCatalogItemProps) => {

    const [exterior, setExterior] = useState<ItemSpecMedia[]>()
    const [interior, setInterior] = useState<ItemSpecMedia[]>()
    const [spaceMedia, setSpaceMedia] = useState<ItemSpecMedia[]>()

    useEffect(() => {
        console.log("value change")
        setExterior(value?.medias?.filter(e => e.catalog == MediaCatlog.exterior))
        setInterior(value?.medias?.filter(e => e.catalog == MediaCatlog.interior))
        setSpaceMedia(value?.medias?.filter(e => e.catalog == MediaCatlog.space))
    }, [value]);

    const onMediaRemove=(file: UploadFile<UploadedMedia>)=>{
        return new  Promise<boolean>((resolve,reject)=>{
            console.log("onRemove:",file)
            if(file.status== "error"){
                resolve(true)
            }
            if(file.status=="done"){
                specService.deleteSpecMedia([file.uid]).then(()=>{
                    resolve(true)
                }).catch((reason)=>{
                    message.error("删除图片失败:"+reason)
                    reject(reason)
                })
            }
        })
    }
    return (
        <>
            <div style={{width: "100%", paddingTop: 15}}>

                <Space direction={"vertical"} style={{width: "100%", paddingTop: 15}}>
                    <Row gutter={0}
                         style={{
                             background: "#eeeeee",
                             paddingLeft: 20,
                             paddingTop: 10,
                             paddingBottom: 10,
                             paddingRight: 20,
                             alignItems: "center",
                             borderRadius: 8
                         }}>
                        <Col span={20} style={{display: "flex", alignItems: "center", alignContent: "center"}}>
                            <span style={{width: 100, color: "#000000", fontWeight: "bold"}}>车身颜色: </span>
                            <ItemSpecColorWidget mode={widgetMode} value={value} onFinish={onSaveColor}/>
                        </Col>
                        <Col span={4} style={{display: "flex", justifyContent: "right"}}>
                            <Popconfirm
                                placement="top"
                                        title="确认删除"
                                        description={"确定要删除些颜色分类？此操作将删除此颜色分类下的所有图片" }
                                        onConfirm={() => onRemoveColor?onRemoveColor(value?.colorId):null}
                                        okText="是"
                                        cancelText="否"
                            >
                            <Button size="small" type="primary" danger>删除</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                    <Row gutter={0}>
                        <Col span={24}>
                            <Form.Item
                                label="外观"
                                labelCol={{span: 2}}
                                wrapperCol={{span: 24}}
                            >
                                <MediaUploader value={exterior as UploadedMedia[]} onRemove={onMediaRemove}
                                               action={import.meta.env.VITE_APP_BASE_API + `/api/admin/svc/item-spec-media?specId=${value?.specId}&catalog=${MediaCatlog.exterior}&colorId=${value?.colorId}`}/>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="内饰"
                                labelCol={{span: 2}}
                                wrapperCol={{span: 24}}
                            >
                                <MediaUploader value={interior as UploadedMedia[]}
                                               action={import.meta.env.VITE_APP_BASE_API + `/api/admin/svc/item-spec-media?specId=${value?.specId}&catalog=${MediaCatlog.interior}&colorId=${value?.colorId}`}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="空间"
                                labelCol={{span: 2}}
                                wrapperCol={{span: 24}}
                            >
                                <MediaUploader value={spaceMedia as UploadedMedia[]}
                                               action={import.meta.env.VITE_APP_BASE_API + `/api/admin/svc/item-spec-media?specId=${value?.specId}&catalog=${MediaCatlog.space}&colorId=${value?.colorId}`}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Space>
            </div>
        </>
    )
}

type ItemSpecImageFormProps = {
    specId?: string
}
const ItemSpecImageForm = ({specId}: ItemSpecImageFormProps) => {

    const [form] = useForm()
    const [specColors, setSpecColors] = useState<ItemSpecColor[]>([])
    const [loading, setLoading] = useState(false)
    const [colorWidgetMode,setColorWidgetMode] = useState<"edit"|"view">("view")
    const onAddItem = () => {
        setSpecColors([...specColors,])
        specService.createSpecColor({
            colorId: "",
            specId: specId,
            value: "#ffffff",
            name: "",
            medias: [],
        }).then(resp => {
            console.log(resp)
            setLoading(false)
            loadColors()
        }).catch(() => setLoading(false))
    }

    const onUpdateColor = (val: ItemSpecColor) => {
        setLoading(true)
        setColorWidgetMode("edit")
        specService.updateSpecColor(val).then(resp => {
            console.log(resp)
            setLoading(false)
            loadColors()
            setColorWidgetMode("view")
        }).catch(() => {
            setLoading(false)
        })
    }

    const onRemoveColor=(colorId?:string)=>{
        if(colorId){
            setLoading(true)
            specService.deleteSpecColor([colorId]).then(()=>{
                loadColors()
            })
        }
    }
    const loadColors = () => {
        setLoading(true)
        specService.getMediaOfSpec(specId as string).then(resp => {
            resp.data
            setSpecColors(resp.data)
            form.resetFields()
        }).finally(() => setLoading(false))
    }
    useEffect(() => {
        console.log("specId:", specId)
        if (specId) {
            loadColors()
        } else {
            setSpecColors([])
            form.resetFields()
        }

    }, [specId]);

    return (
        <>
            <Spin spinning={loading}>
                <Row>
                    <Button icon={<PlusOutlined/>} type="primary" onClick={onAddItem}>添加</Button>
                </Row>
                <Row>
                    <Form
                        style={{width: "100%"}}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        form={form}
                        name="itemFrom"
                        initialValues={specColors}
                    >
                        {specColors.map((color, i) => (
                            <MediaCatalogItem value={color}
                                              widgetMode={colorWidgetMode}
                                              onSaveColor={onUpdateColor}
                                              onRemoveColor={onRemoveColor}
                                              key={i}/>
                        ))}
                    </Form>
                </Row>
            </Spin>
        </>
    )
}
export default ItemSpecImageForm