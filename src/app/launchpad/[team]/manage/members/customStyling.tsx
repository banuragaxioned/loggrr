export const columnStyleHandler = (id:string)=> {
   return  id === 'name' ? 
    'w-[35%]':
    id === 'email' ? 
    'w-[45%] max-w-[150px]':
    id === 'role' ?
    'w-[15%]':
    id === 'status' ?
    'w-[15%]':
    'w-auto'
}

export const cellStyleHandler = (id:string)=>{
    return  id === 'name' ? 
    'w-[35%]':
    id === 'email' ? 
    'w-[45%] max-w-[150px]':
    id === 'role' ?
    'w-[15%]':
    id === 'status' ?
    'w-[15%]':
    'w-auto'
}
