export const ControlPanel = ({children}:{children:React.ReactNode})=> {

    return (
        <div className="mb-3 flex items-center gap-x-3 rounded-xl border-[1px] border-border p-[15px]">
            {children}
        </div>
    )
}