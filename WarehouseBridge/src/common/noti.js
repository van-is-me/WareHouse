import { toast } from 'react-toastify'
export default class noti {
    static success(message, timeout = 1500) {
        return toast.success(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    static error(message, timeout = 1500) {
        return toast.error(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    static warning(message, timeout = 1500) {
        return toast.warn(message, {
            position: "top-right",
            autoClose: timeout,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

}