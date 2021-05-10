import * as React from 'react';
import * as Icons from '@material-ui/icons/';
import * as MDIIcons from 'mdi-material-ui';

function upperFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length)
}
  
function fixIconNames(string) {
    const name = string.split('-').map(upperFirst).join('')
    if (name === '3dRotation') {
        return 'ThreeDRotation'
    } else if (name === '4k') {
        return 'FourK'
    } else if (name === '360') {
        return 'ThreeSixty'
    }
    return name;
}

export default function DynamicIcon(props) {

    const isMDI = (name) => {
        if(name.split('-')[0] === 'mdi'){
            return true;
        }
        return false;
    }

    const getIcon = () => {
        let Icon;
        if(isMDI(props.iconName)){
            const iconName = fixIconNames(props.iconName.replace('mdi-',''));
            Icon = MDIIcons[iconName];   
        }
        else{
            const iconName = fixIconNames(props.iconName);
            Icon = Icons[iconName];   
        }    
        return (<Icon className={props.className}/>);
    };

    return (
        <>
        {getIcon()}
        </>
    );
}
