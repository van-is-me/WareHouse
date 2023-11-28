import { useEffect } from 'react';
import '../css/ConfirmEmail.css'
import API from '../API';
import noti from '../common/noti';
function ConfirmEmail() {
    const currentUrl = window.location.href
    const url = new URL(currentUrl)
    const code = url.searchParams.get("code")
    const userId = url.searchParams.get("userId")
    useEffect(() => {
        API.confirmEmail(code, userId)
        .then(res => {
            noti.success(res.data, 5000)
        })
        .catch(err => {
            noti.error('Có lỗi xảy ra, vui lòng thử lại!')
            console.log(err)
        })
    }, [])
    return (
        <div className="bg-cus"></div>
    )
}

export default ConfirmEmail