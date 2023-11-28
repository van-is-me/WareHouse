import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../API"
import { useDispatch } from "react-redux"
import '../css/WarehouseItem.css'
import { changeLoadingState } from '../reducers/SystemReducer'
function WarehouseItem({ item }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [listImage, setListImage] = useState([])
    useEffect(() => {
        dispatch(changeLoadingState(true))
        API.imageByWarehouseId(item?.id)
            .then(res => {
                dispatch(changeLoadingState(false))
                setListImage(res.data)
            })
            .catch(err => {
                dispatch(changeLoadingState(false))
            })
    }, [])
    function goToDetail(id, orderNow = false) {
        navigate(`/warehouse-detail/${id}`,
            {
                state: {
                    WHname: item?.name,
                    latitude: item?.latitudeIP,
                    longitude: item?.longitudeIP,
                    listImage: listImage,
                    description: item?.description,
                    shortDescription: item?.shortDescription,
                    categoryId: item?.categoryId,
                    orderNow: orderNow
                }
            })
    }

    const getOrderNow = (id) => {
        goToDetail(id, true)
    }
    return (
        <div className='shadow-lg pb-4 my-3 w-full'>
            <div className="w-full h-[200px] overflow-hidden flex items-center"><img src={listImage[0]?.imageURL} className='w-full' alt="" /></div>
            <div className='w-full px-6'>
                <p className='text-primary text-[24px] font-bold mt-3 truncate-cus' title={item?.name}>{item?.name}</p>
                <p title={item?.address} className='text-[#666] mt-3 font-bold truncate-item'>
                    {item?.address}
                </p>
                {/* <div className='flex items-center justify-between flex-wrap w-full my-3 text-[#666]'>
                    <p>120k/tháng</p> |
                    <p>220k/tháng</p> |
                    <p>320k/tháng</p>
                </div> */}
                <p className='text-[#666] truncate-cus' title={item?.shortDescription}>
                    {item?.shortDescription}
                </p>
                <div className='flex mt-3 justify-center w-full'>
                    <button onClick={() => goToDetail(item?.id)} className='btn-secondary px-3 md:px-4 py-2 uppercase w-[45%] text-[10px] xl:text-[15px] mx-2'>Chi tiết</button>
                    <button onClick={() => getOrderNow(item?.id)} className='btn-primary  px-3 md:px-4 py-2 uppercase w-[45%] text-[10px] xl:text-[15px] mx-2'>đặt ngay</button>
                    {/* <button className='btn-primary  px-3 md:px-4 py-2 uppercase w-[45%] text-[10px] xl:text-[15px] mx-2'>đặt ngay</button> */}
                </div>
            </div>
        </div>
    )
}

export default WarehouseItem