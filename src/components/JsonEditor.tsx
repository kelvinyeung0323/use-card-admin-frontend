import  { useEffect,  useRef, useState} from "react";

import JSONEditor  from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import {Alert, Space} from "antd";

type JsonEditorProps = {
    value?: string
    onChange?: (value: string) => void
}
const JsonEditor = ({value, onChange}: JsonEditorProps) => {

    const containerRef = useRef<HTMLDivElement | null>(null)
    const editorRef = useRef<JSONEditor | null>()
    const [error,setError] = useState<Error|null>()

    useEffect(() => {
        if (containerRef.current) {
            editorRef.current = new JSONEditor(containerRef.current, {
                mode: "code",
                modes: ["tree", "view", "form", "code", "text", "preview"],
                navigationBar:true,
                language:'zh-CN',
                mainMenuBar:true,
                onChangeText:onChange,
                onError:(error)=>setError(error)
            })
        }
        return () => {
            editorRef.current?.destroy()
            editorRef.current = null
        }
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current?.setText(value as string)
        }
    }, []);

    return (
        <>
            <Space direction="vertical" style={{width:"100%"}}>
            {error&& <Alert
                message={error?.name}
                description={error?.message}
                type="error"
                showIcon
                closable
                onClose={()=>setError(null)}
            />}
            <div ref={containerRef} style={{height:600}}/>
            </Space>
        </>
    )
}

export default JsonEditor