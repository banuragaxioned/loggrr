export const columnStyleHandler = (id:string)=> {
   return  id === 'name' ? 
    'w-[30%]':
    id === 'email' ? 
    'w-[40%]':
    id === 'role' ?
    'w-[15%]':
    id === 'status' ?
    'w-[15%]':
    'w-auto'
}

export const cellStyleHandler = (id:string)=>{
    return  id === 'name' ? 
    'w-[30%]':
    id === 'email' ? 
    'w-[40%]':
    id === 'role' ?
    'w-[15%]':
    id === 'status' ?
    'w-[15%]':
    'w-auto'
}
