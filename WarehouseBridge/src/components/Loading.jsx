import '../css/Loading.css'
function Loading() {
    return (
        <div className='z-[99] fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/60'>
            <div className="loader">
                <div className="circle" />
                <div className="circle" />
                <div className="circle" />
                <div className="shadow" />
                <div className="shadow" />
                <div className="shadow" />
            </div>
        </div>
    )
}

export default Loading