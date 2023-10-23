/**
 * 通用ts方法封装处理
 */

//日期格式化
export function parseTime(time:Date|string|number,pattern:string):string|null{
    if(arguments.length === 0 || !time){
        return null
    }
    const format = pattern||"{y}-{m}-{d} {h}:{i}:{s}"
    let date:Date
    if(typeof time === "object"){
        date = time
    }else {
        if((typeof  time === "string") && (/^[0-9]+$/.test(time))){
            time = parseInt(time)
        }else if(typeof time === "string"){
            time = time.replace(new RegExp(/-/gm),"/").replace("T"," ").replace(new RegExp(/\.[\d]{3}/gm),"");
        }
        if ((typeof time==="number")&& (time.toString().length == 10)){
            time = time * 1000
        }
        date = new Date(time)
    }
    type Format={
        y:number,
        m:number,
        d:number,
        h:number,
        i:number,
        s:number,
        a:number,
    }
    type KeyType = keyof Format
    const formatObj:Format ={
        y:date.getFullYear(),
        m:date.getMonth(),
        d:date.getDate(),
        h:date.getHours(),
        i:date.getMinutes(),
        s:date.getSeconds(),
        a:date.getDate(),
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g,(result:string,key:string):string=>{
        const value = formatObj[key as KeyType]
        if(key === 'a'){return ["日","一","二","三","四","五","六"][value]}
        let r :string = "0"
        if(result.length >0 && value < 10){
             r=  "0" + value;
        }
        return r
    })
    return  timeStr


}




export function  toUrlParams(params:never):string{
    const paramsStr = Object.keys(params)
        .filter(key=>params[key] != null && params[key] != undefined)
        .map((key)=>{
            let obj = params[key];
           if(Array.isArray(obj)){
                obj = (obj as Array<never>).map(v=>encodeURIComponent(v)).join(",") as never;
            }
            return key + "="+obj;
        }).join("&");
    return paramsStr

}