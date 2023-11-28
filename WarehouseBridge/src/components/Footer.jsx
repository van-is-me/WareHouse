import logoFooter from '../assets/images/footer.png'
import { MdLocationOn } from 'react-icons/md'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { AiFillMail } from 'react-icons/ai'
function Footer() {
    return (
        <div className="w-full bg-primary min-h-screen flex items-center md:items-start justify-around flex-wrap py-[20vh] flex-col md:flex-row">
            <div className="flex items-center flex-col w-[90%] md:w-[50%] bg-secondary py-5 px-14">
                <img src={logoFooter} alt="" className='w-full' />
                <p className='text-center text-primary my-2 text-[14px] md:text-[20px]'>
                    Warehousebridge – mang không gian đến với khách hàng, <span className='text-white'>hệ thống kết nối khách hàng cần không gian lưu trữ với các chủ kho, phù hợp với hầu hết nhu cầu của khách hàng.</span>
                </p>
            </div>
            <div className='w-[90%] md:w-[40%] flex flex-col items-start mt-8 md:mt-0'>
                <p className='uppercase text-secondary'>liên hệ</p>
                <p className='text-white flex my-2 items-center text-[12px] lg:text-[18px]'><MdLocationOn className='text-white text-[18px]' /> &nbsp;  Tầng 6 NVH Sinh Viên - ĐHQG, TP.HCM</p>
                <p className='text-white flex my-2 items-center text-[12px] lg:text-[18px]'><BsFillTelephoneFill className='text-white text-[18px]' /> &nbsp;  +0975688774</p>
                <p className='text-white flex my-2 items-center text-[12px] lg:text-[18px]'><AiFillMail className='text-white text-[18px]' /> &nbsp; warehousebridge.service@gmail.com</p>
            </div>
        </div>
    )
}

export default Footer