import {
    Button,
    Drawer,
    Row,
    Space,
    Table,
    Pagination,
    message,
    Popconfirm,
    Form,
    Input,
    Col, Select,
} from "antd";
import {PlusOutlined, MinusOutlined, FormOutlined, DownOutlined, DeleteOutlined,AuditOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react"
import ItemForm from "./components/ItemForm.tsx";
import {ProdItem, ProdItemQueryForm} from "@/models/item-model.ts";
import * as itemService from "@/service/item-service.ts"
import KDateRangePicker from "@/components/KDateRangePicker.tsx";
import MediaPreviewer from "@/views/prod/components/MediaPreviewer.tsx";


const {Column} = Table;
const {Option} = Select

type FormMode = "new" | "edit"

interface FormRef {
    validate: () => Promise<ProdItem>
    getData: () => ProdItem[]
}

const initailForm: ProdItem = {
    onSale: false,
}

function ItemManagement() {


    const [drawerOption, setDrawerOption] = useState({
        open: false,
        title: "添加商品",
        mode: "new",
        loading: false,

    })
    const [formState, setFormState] = useState<ProdItem>()
    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [formMode, setFormMode] = useState<FormMode>("new")
    const formRef = React.createRef<FormRef>()

    const [tableOption, setTableOption] = useState({
        datasource: [] as ProdItem[], total: 0, currentPage: 1, selectedRowKeys: [] as string[], loading: false
    })
    const [expandSearch, setExpandSearch] = useState(false)


    let queryForm:ProdItemQueryForm={
        pageNum: 1,
        pageSize: 10,
    }
    const doQuery = (values: ProdItemQueryForm) => {
        queryForm={...queryForm, ...values, pageNum: 1}
        loadItems()
    }

    const onResetQuery = () => {
        doQuery({} as ProdItemQueryForm)
    }

    const openDrawer = (mode: FormMode, itemId: string) => {
        setFormMode(mode)
        console.log("open drawer,mode", formMode)
        if (mode == "edit") {
            setDrawerOption({...drawerOption, title: "修改商品", open: true, loading: true})
            itemService.getItem(itemId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    resp.data.belongingPlaceArr = resp.data.belongingPlace?.split(",")
                    setFormState(resp.data)
                }
            }).finally(() => setDrawerOption({...drawerOption, title: "修改商品", open: true, loading: false}))
        } else {
            setFormState({...initailForm})
            setDrawerOption({...drawerOption, title: "添加商品", open: true})
            console.log("new form:",drawerOption)
        }

    }
    const onDrawerClose = () => {
        setDrawerOption({...drawerOption, open: false})
    }


    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ProdItem[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setTableOption({...tableOption, selectedRowKeys: selectedRowKeys as string[]})
        },
        getCheckboxProps: (record: ProdItem) => ({
            disabled: record.itemId === 'Disabled User', // Column configuration not to be checked
            name: record.itemId,
        }),
    };
    const loadItems = () => {
        itemService.queryItems(queryForm).then((res) => {
            setTableOption({...tableOption, datasource: res.data,total: res.total||0,currentPage: res.pageNum||1,})
        })
    }


    const onPageChange = (page: number, pageSize: number) => {
        queryForm={...queryForm, pageSize: pageSize, pageNum: page}
        loadItems()
    }

    useEffect(() => {
        loadItems()
    }, []);


    const onSaveRes = () => {
        console.log("form Mode is", formMode)
        formRef.current?.validate().then((values) => {
            values.belongingPlace = values.belongingPlaceArr?.join(",")
            if (formMode == "new") {
                setDrawerOption({...drawerOption, open: true})
                itemService.createItem(values).then(() => {
                    message.info("添加商品成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadItems()
                }).finally(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            } else {
                setDrawerOption({...drawerOption, open: true})
                values.itemId = formState?.itemId || ""
                itemService.updateItem(values).then(() => {
                    message.info("修改商品信息成功")
                    setDrawerOption({...drawerOption, open: false})
                    loadItems()
                }).finally(() => {
                    // setDrawerOption({...drawerOption, open: false})
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }

    const onDeleteItems = (itemIds: string[]) => {
        setTableOption({...tableOption, loading: true})
        itemService.deleteItem(itemIds).then(resp => {
            message.info(resp.msg)
            loadItems()
        }).finally(() => setTableOption({...tableOption, loading: false}))
    }



    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row gutter={24}>
                    <Form
                        style={{padding: 24, maxWidth: "none"}}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        onFinish={doQuery}
                        onReset={onResetQuery}>
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    label="商品编号"
                                    name="itemId"
                                >
                                    <Input allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="标题"
                                    name="title">
                                    <Input allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="副标题"
                                    name="subTitle">
                                    <Input allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="创建时间"
                                    name="createdTimeRange">
                                    <KDateRangePicker/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="车型"
                                    name="vehicleModel">
                                    <Input allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="使用性质"
                                    name="usageNature">
                                    <Select placeholder="使用性质" allowClear>
                                        <Option value="营运">营运</Option>
                                        <Option value="非营运">非营运</Option>
                                        <Option value="营转非">营转非</Option>
                                        <Option value="出租转非">出租转非</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {expandSearch ? (
                                <>
                                    <Col span={8}>
                                        <Form.Item
                                            label="排放标准"
                                            name="emissionStd">
                                            <Input allowClear/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="排放标准"
                                            name="displacement">
                                            <Select placeholder="排放标准" allowClear>
                                                <Option value="国Ⅵ B">国Ⅵ B</Option>
                                                <Option value="国Ⅵ A">国Ⅵ A</Option>
                                                <Option value="国Ⅴ">国Ⅴ</Option>
                                                <Option value="国Ⅳ">国Ⅳ</Option>
                                                <Option value="国Ⅲ">国Ⅲ</Option>
                                                <Option value="国Ⅱ">国Ⅱ</Option>
                                                <Option value="国Ⅰ">国Ⅰ</Option>

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="车牌地"
                                            name="belongingPlace">
                                            <Input allowClear/>
                                        </Form.Item>
                                    </Col>
                                </>
                            ) : ""}


                        </Row>


                        <Form.Item>
                            <Space>
                                <Button htmlType="submit" type="primary">查询</Button>
                                <Button htmlType="reset">重置</Button>
                                <a
                                    style={{fontSize: 12}}
                                    onClick={() => {
                                        setExpandSearch(!expandSearch);
                                    }}
                                >
                                    <DownOutlined rotate={expandSearch ? 180 : 0}/> Collapse
                                </a>
                            </Space>
                        </Form.Item>
                    </Form>
                </Row>
                <Row>
                    <Space>


                        <Button type="primary" onClick={() => openDrawer("new", "")}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={tableOption.selectedRowKeys.length <= 0}
                            description={"确定要删除" + tableOption.selectedRowKeys.length + "个用户吗？"}
                            onConfirm={() => onDeleteItems(tableOption.selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger icon={<MinusOutlined/>}
                                    disabled={tableOption.selectedRowKeys.length <= 0}>删除</Button>
                        </Popconfirm>
                    </Space>
                </Row>
                <Row>
                    <Table
                        rowKey="itemId"
                        size="small"
                        scroll={{x: 2300}}
                        tableLayout="fixed"
                        dataSource={tableOption.datasource}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}>
                        <Column title="图片" fixed="left" dataIndex="medias" align="center"
                                key="medias"
                                render={(medias) => (
                                    <MediaPreviewer medias={medias}/>
                                    )}
                        />

                        <Column title="标题" fixed="left" dataIndex="title" key="title"/>
                        <Column title="商品编号"  dataIndex="itemId" key="itemId"/>
                        <Column title="使用性质" dataIndex="usageNature" key="usageNature"/>
                        <Column title="排放标准" dataIndex="emissionStd" key="emissionStd"/>
                        <Column title="排量" dataIndex="displacement" key="displacement"/>
                        <Column title="变速箱" dataIndex="gearbox" key="gearbox"/>
                        <Column title="车身颜色" dataIndex="bodyColor" key="bodyColor"/>
                        <Column title="车牌地" dataIndex="belongingPlace" key="belongingPlace"/>
                        <Column title="里程" dataIndex="mileage" key="mileage"/>
                        <Column title="首次上牌时间" dataIndex="registrationDate" key="registrationDate"/>
                        <Column title="年审时间" dataIndex="annualChekDate" key="annualChekDate"/>
                        <Column title="交强险截日期" dataIndex="insuranceExpiredDate" key="insuranceExpiredDate"/>
                        <Column title="车船使用税有效日期" dataIndex="usageTaxValidDate" key="usageTaxValidDate"/>
                        <Column title="状态" dataIndex="onSale" key="onSale"/>
                        <Column title="创建日期" dataIndex="createdAt" key="createdAt"/>
                        <Column
                            title="操作"
                            key="action"
                            fixed="right"
                            render={(_: string, prodItem: ProdItem) => (
                                <Space size="middle">
                                    <a key="edit" title="编辑商品"
                                       onClick={() => openDrawer("edit", prodItem.itemId as string)}><FormOutlined/></a>
                                    <a title="删除"><DeleteOutlined/></a>
                                    <a title="检测报告"><AuditOutlined /></a>
                                </Space>
                            )}
                        />
                    </Table>
                </Row>
                <Row style={{justifyContent: "flex-end"}}>
                    <Pagination
                        showSizeChanger
                        defaultPageSize={10}
                        current={tableOption.currentPage}
                        onChange={onPageChange}
                        showTotal={(total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`}
                        pageSizeOptions={[5, 10, 20, 50]}
                        total={tableOption.total}/>
                </Row>
            </Space>
            <Drawer
                title={drawerOption.title}
                width={720}
                onClose={onDrawerClose}
                open={drawerOption.open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onDrawerClose}>取消</Button>
                        <Button onClick={onSaveRes} type="primary">
                            提交
                        </Button>
                    </Space>
                }
            >
                <ItemForm formState={formState as ProdItem} ref={formRef} loading={drawerOption.loading}/>
            </Drawer>
        </>
    )
}

export default ItemManagement