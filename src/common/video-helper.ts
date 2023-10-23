/**
 * 视频截图
 * @param {string} videoInfo.url - 视频链接
 * @param {string} videoInfo.progress - 视频截取的秒数
 * @author
 * @returns {Promise.resolve(base64)}
 */


type SnapshotPops ={url:string,progress:number}
type Snapshot ={
    base64:string
}
export const videoSnapshot = (props:SnapshotPops):Promise<Snapshot> => {
    return new Promise((resolve, reject) => {


        const video = document.createElement('video')
        video.currentTime = props.progress  //截取第几秒
        video.setAttribute('crossOrigin', 'anonymous')  //解决资源跨域问题
        // video.setAttribute('crossOrigin', 'user')  //解决资源跨域问题
        video.setAttribute('src', props.url+"?_t="+Date.now())  //资源链接，加上时间戳，不然有缓存会产生跨域错误

        // 当媒介数据已加载时运行的脚本。
        video.addEventListener('loadeddata', function () {

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (ctx == null){
                reject({
                    msg:"创建画布上下文失败"
                })
                return
            }
            const ratio = window.devicePixelRatio // 设备像素比（更正分辨率）
            canvas.width = video.videoWidth * ratio
            canvas.height = video.videoHeight * ratio
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height) //绘制图片
            resolve({
                base64: canvas.toDataURL('image/png') // 输出base64
            })

        })

        video.addEventListener('error', function (event) {
            reject({
                msg: '视频资源异常',
                err:event
            })
        })
    })
}
