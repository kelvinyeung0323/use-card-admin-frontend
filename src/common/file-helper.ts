//图片压缩


// 上传图片前的钩子函数
import {message} from "antd";
import {RcFile} from "antd/es/upload";

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};
export type UploadedFile ={
    id:string
    url:string
    name:string
    size:number
}
export function beforeImageUpload (file:RcFile) {
    return new Promise(async (resolve, reject) => {
        if (!file.type.includes('image')) {
            message.warning('请上传图片')
            reject(new Error('请上传图片'))
            return
        }
        // isShowSpinning = true
        const newFile = await compressImg(file)
        resolve(newFile)
    })
}


// export function customImageRequest (info:{file:RcFile}) {
//     const { file } = info
//     // blob方式预览图片
//      const imageUrl = window.URL.createObjectURL(file)
//     // 组装数据
//     const formData = new FormData()
//     formData.append('files', file)
//     // 发送请求
//     getUplodBackName(formData).then(res => {
//         this.$message.success('上传成功')
//     }).catch(() => {
//         this.$message.warning('上传失败')
//     }).finally(() => {
//         this.isShowSpinning = false
//     })
// }


// base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
export function dataURLtoFile (dataurl:string, filename:string) {
    const arr = dataurl.split(',')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}


export function compressImg(file: File) {


    let files
    const fileSize = file.size / 1024 / 1024
    const read = new FileReader()
    read.readAsDataURL(file)
    return new Promise(function (resolve,reject) {
        read.onload = function (e:ProgressEvent<FileReader> ) {
            const img = new Image()
            img.src = e.target?.result as string
            img.onload = function () {
                // 默认按比例压缩
                const w = img.width
                const h = img.height
                // 生成canvas
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if(ctx == null){
                    reject("can not get context of 2d")
                    return
                }
                let base64
                // 创建属性节点
                canvas.setAttribute('width', w.toString())
                canvas.setAttribute('height', h.toString())

                ctx.drawImage(img, 0, 0, w, h)
                if (fileSize < 1) {
                    // 如果图片小于一兆 那么压缩0.5
                    base64 = canvas.toDataURL(file['type'], 0.5)
                } else if (fileSize > 1 && fileSize < 2) {
                    // 如果图片大于1M并且小于2M 那么压缩0.5
                    base64 = canvas.toDataURL(file['type'], 0.5)
                } else {
                    // 如果图片超过2m 那么压缩0.2
                    base64 = canvas.toDataURL(file['type'], 0.2)
                }
                // 回调函数返回file的值（将base64编码转成file）
                files = dataURLtoFile(base64, file.name) // 如果后台接收类型为base64的话这一步可以省略
                resolve(files)
            }
        }
    })
}

