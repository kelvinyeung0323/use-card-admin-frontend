import {Cascader, Col, Form, Input, Radio, Row, Select, Spin} from "antd";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import type {DefaultOptionType} from 'antd/es/cascader';
import {AreaItem} from "@/models/sys-model.ts";
import MediaUploader from "@/views/prod/components/MediaUploader.tsx";
import {ProdItem} from "@/models/item-model.ts";
import {getArea} from "@/common/area.ts";
import {useForm} from "antd/es/form/Form";
import locale from "antd/es/date-picker/locale/zh_CN";
import KDatePicker from "@/components/KDatePicker.tsx";

const {Option} = Select

import VehicleModelCascader from "@/views/prod/components/VehicleModelCascader.tsx";

interface Props{
    formState?:ProdItem
    loading?:boolean
}

const ItemForm= forwardRef(({formState,loading}:Props,ref) =>{


    useImperativeHandle(ref, () => ({
        validate: form.validateFields,
        getData: form.getFieldsValue
    }))

    const [cityOption, setCityOption] = useState<AreaItem[]>()
    const [form] = useForm()

    const filter = (inputValue: string, path: DefaultOptionType[]) =>
        path.some(
            (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
        );




    useEffect(() => {
        setCityOption(getArea())
    }, []);

    useEffect(() => {
        form.resetFields()
    }, [formState]);


    return (
        <>
            <Spin spinning={loading}>
            <Form labelCol={{span: 6}}
                  wrapperCol={{span: 24}}
                  form={form}

                  name="itemFrom"
                  initialValues={formState}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="itemId"
                            label="商品编号"
                            rules={[{required: false, message: '商品编号'}]}
                        >
                            <Input placeholder="商品编号" disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="onSale"
                            label="状态"
                            rules={[{required: true, message: '状态'}]}
                        >
                            <Radio.Group
                                buttonStyle="solid"
                            >
                                <Radio value={true}>在售</Radio>
                                <Radio value={false}>下架</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="标题"
                            rules={[{required: true, message: '标题'}]}
                        >
                            <Input placeholder="标题"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="subTitle"
                            label="副标题"
                            rules={[{required: true, message: '副标题'}]}
                        >
                            <Input placeholder="副标题"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="vehicleModel"
                            label="车型"
                            rules={[{required: false, message: '车型'}]}
                        >
                            {/*<Input placeholder="车型"/>*/}
                            <VehicleModelCascader/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="usageNature"
                            label="使用性质"
                            rules={[{required: true, message: '使用性质'}]}
                        >
                            <Select placeholder="使用性质">
                                <Option value="营运">营运</Option>
                                <Option value="非营运">非营运</Option>
                                <Option value="营转非">营转非</Option>
                                <Option value="出租转非">出租转非</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="emissionStd"
                            label="排放标准"
                            rules={[{required: false, message: '排放标准'}]}
                        >
                            <Select placeholder="排放标准">
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
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="displacement"
                            label="排量"
                            rules={[{required: true, message: '排量'}]}
                        >
                            <Input placeholder="1.5T"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="gearbox"
                            label="变速箱"
                            rules={[{required: true, message: '变速箱'}]}
                        >
                            <Input placeholder="变速箱"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="bodyColor"
                            label="车身颜色"
                            rules={[{required: true, message: '车身颜色'}]}
                        >
                            <Input placeholder="车身颜色"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="belongingPlaceArr"
                            label="车牌地"
                            rules={[{required: true, message: '车牌地'}]}
                        >
                            <Cascader
                                expandTrigger="hover"
                                options={cityOption}
                                placeholder="Please select"
                                showSearch={{filter}}
                                onSearch={(value) => console.log(value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="mileage"
                            label="里程"
                            rules={[{required: true, message: '里程'}]}
                        >
                            <Input placeholder="里程"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            labelCol={{span: 10}}
                            name="registrationDate"
                            label="首次上牌时间"
                            rules={[{required: true, message: '首次上牌时间'}]}
                        >
                            <KDatePicker locale={locale} placeholder="首次上牌时间" format="YYYY-MM-DD"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            labelCol={{span: 11}}
                            name="annualCheckDate"
                            label="年审时间"
                            rules={[{required: true, message: '年审时间'}]}
                        >
                            <KDatePicker locale={locale} placeholder="年审时间" format="YYYY-MM-DD"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="insuranceExpiredDate"
                            labelCol={{span: 10}}
                            label="交强险截止日期"
                            rules={[{required: true, message: '交强险截止日期'}]}
                        >
                            <KDatePicker locale={locale} placeholder="交强险截止日期" format="YYYY-MM-DD"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="usageTaxValidDate"
                            labelCol={{span: 11}}
                            label="车般使用税有效日期"
                            rules={[{required: true, message: '车般使用税有效日期'}]}
                        >
                            <KDatePicker locale={locale} placeholder="车般使用税有效日期" format="YYYY-MM-DD"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{span: 3}}
                            name="medias"
                            label="图片"
                            rules={[{required: false, message: '图片'}]}
                        >
                            <MediaUploader/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{span: 3}}
                            name="remark"
                            label="备注"
                            rules={[
                                {
                                    required: false,
                                    message: 'please enter url description',
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} placeholder="please enter url description"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </Spin>
        </>
    )
})
export default ItemForm