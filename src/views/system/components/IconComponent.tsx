import  * as Icons  from '@ant-design/icons/lib/icons';
import {Select} from "antd";

import {observer} from "mobx-react-lite";
const { Option } = Select;
type IconName = keyof typeof Icons;


const getIcon = (iconName: IconName): null|React.ComponentType<React.HTMLAttributes<HTMLElement>> => {
    // Check if the icon name is a valid Ant Design icon name.
    if (!Object.keys(Icons).includes(iconName)) {
        return null;
    }

    // Return the corresponding Ant Design icon component type.
    return Icons[iconName];
};

const IconComponent = ({ iconName }: { iconName: string }) => {

    const name:IconName = iconName as IconName
    const Icon = getIcon(name);

    if (!Icon) {
        return null;
    }

    return <Icon />;
};

const IconSelectComponent:React.FC<{value?:string|undefined,onChange?:(value:string)=>void}> = observer(({value,onChange})=>{


    return (
        <Select
            style={{ width: 300 }}
            showSearch={true}
            value={value}
            onChange={onChange}
        >
            {Object.keys(Icons).filter(key=>key.endsWith("Outlined")).map((key:string)=>{
                return (
                    <Option value={key} label={key}  key={key}>
                        <IconComponent iconName={key}/><span>{key}</span>
                    </Option>
                    )
            })}

        </Select>
    );

})



export { IconComponent,IconSelectComponent}