

export const isEmpty = (value) =>{
 const res=   value == undefined  ||
    value == null ||
    typeof value =='string' && value.trim()==''||
    typeof value =='object' && Object.keys(value).length==0

    return res
}