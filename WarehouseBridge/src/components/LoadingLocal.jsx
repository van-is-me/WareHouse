import '../css/LoadingLocal.css'
function LoadingLocal() {
    return (
        <div className="w-full flex items-center justify-center fixed background-fog top-0 left-0 right-0 bottom-0">
            <div className="loader">
                <span />
                <span />
                <span />
            </div>
        </div>
    )
}

export default LoadingLocal