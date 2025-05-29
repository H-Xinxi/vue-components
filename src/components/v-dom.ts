export const VDOM = ({dom,...props}) => {
    for(let [key,value] of Object.entries(props)) {
        if(key.startsWith('on')) {
            (dom as HTMLElement).addEventListener(key.slice(2).toLowerCase(), value)
        } else {
            (dom as HTMLElement).setAttribute(key, value)
        }
    }
    return null
}