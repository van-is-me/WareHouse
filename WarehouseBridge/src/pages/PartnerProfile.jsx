import { useParams } from "react-router-dom"
import { BiLogoFacebook, BiLogoInstagramAlt, BiLogoTwitter } from 'react-icons/bi'
import '../css/Partner.css'
import WarehouseItem from "../components/WarehouseItem"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import API from "../API"
import noti from '../common/noti'
import { changeLoadingState } from "../reducers/SystemReducer"

function PartnerProfile() {
  const { pnname } = useParams()
  const dispatch = useDispatch();
  const [item, setItem] = useState({})
  const [list, setList] = useState([])
  useEffect(() => {
    fetchLProviderById()
    fetchListWarehouseByProvider()
  }, [])

  function fetchLProviderById() {
    dispatch(changeLoadingState(true))
    API.providerById(pnname)
      .then(res => {
        dispatch(changeLoadingState(false))
        setItem(res.data)
      })
      .catch((err) => {
        noti.error(err.response?.data)
        dispatch(changeLoadingState(false))
      })
  }

  function fetchListWarehouseByProvider() {
    dispatch(changeLoadingState(true))
    API.warehouseByProvider(pnname)
      .then(res => {
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch((err) => {
        noti.error(err.response?.data)
        dispatch(changeLoadingState(false))
      })
  }
  // const listWarehouse = [
  //   {
  //     id: 1,
  //     name: 'MyStorage',
  //     image: 'https://dunghq21102001.github.io/exe101_tmp/img/khokechung//kho1.jpg',
  //     address: 'Số 103 Đường Vạn Phúc, Quận Hà Đông, Hà Nội',
  //     description: 'Kho kệ chung: là giải pháp tối ưu chi phí nhất cho cá nhân và doanh nghiệp'
  //   },
  //   {
  //     id: 2,
  //     name: 'MyStorage',
  //     image: 'https://dunghq21102001.github.io/exe101_tmp/img/khokechung//kho1.jpg',
  //     address: 'Số 103 Đường Vạn Phúc, Quận Hà Đông, Hà Nội',
  //     description: 'Kho kệ chung: là giải pháp tối ưu chi phí nhất cho cá nhân và doanh nghiệp'
  //   },
  //   {
  //     id: 3,
  //     name: 'MyStorage',
  //     image: 'https://dunghq21102001.github.io/exe101_tmp/img/khokechung//kho1.jpg',
  //     address: 'Số 103 Đường Vạn Phúc, Quận Hà Đông, Hà Nội',
  //     description: 'Kho kệ chung: là giải pháp tối ưu chi phí nhất cho cá nhân và doanh nghiệp'
  //   },
  // ]
  return (
    <div className="w-full bg-[#eee] flex justify-around pt-16 flex-col lg:flex-row">

      {/* left */}
      <div className="w-full lg:w-[26%]">
        <div className="w-full pb-4 bg-white">
          <div className="relative h-[300px] md:h-[600px] lg:h-[200px] overflow-hidden">
            <img className="w-full absolute top-0 left-0 right-0" src={item?.image} alt={item?.image} />
          </div>
          {/* <p className="text-primary text-[24px] font-bold mt-4 text-center">{pnname}</p> */}
          <p className="text-primary text-[24px] font-bold mt-4 text-center">{item?.name}</p>
          <p className="text-[#666] text-[16px] text-center">{item?.address}</p>
        </div>

        <div className="w-full bg-white mt-10 p-3">
          <p className="text-[16px] text-[#666]">
            <span className="font-bold">Giới thiệu:</span>&nbsp;
            {item?.shortDescription}
          </p>
          {/* <hr className="my-3" />
          <div className="w-full py-3 flex items-center px-2 justify-between">
            <BiLogoFacebook className="text-[#3b5998] text-[35px]" /> <span>https://facebook.com/warehouse</span>
          </div>
          <div className="w-full py-3 flex items-center px-2 justify-between">
            <BiLogoTwitter className="text-[#55acee] text-[35px]" /> <span>https://twitter.com/warehouse</span>
          </div>
          <div className="w-full py-3 flex items-center px-2 justify-between">
            <BiLogoInstagramAlt className="text-[#d42d68] text-[35px]" /> <span>https://instagram.com/warehouse</span>
          </div> */}
        </div>
      </div>

      {/* right */}
      <div className="w-full mt-10 lg:mt-0 lg:w-[56%]">
        <div className="w-full text-[#666] text-[18px] bg-white">
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Tên đầy đủ</span>
            <span className="w-[80%]">{item?.name}</span>
          </div>
          <div className="line"></div>
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Email</span>
            <span className="w-[80%]">{item?.email}</span>
          </div>
          <div className="line"></div>
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Phone</span>
            <span className="w-[80%]">{item?.phone}</span>
          </div>
          <div className="line"></div>
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Mobile</span>
            <span className="w-[80%]">{item?.phone}</span>
          </div>
          <div className="line"></div>
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Địa chỉ</span>
            <span className="w-[80%]">{item?.address}</span>
          </div>
          <div className="line"></div>
          <div className="w-full flex px-4 py-6">
            <span className="text-[#444] w-[20%]">Mô tả</span>
            <span className="w-[80%]">{item?.description}</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-12 gap-3">
          {list.map( item => (
            <div key={item.id} className='col-span-12 md:col-span-6'>
              <WarehouseItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PartnerProfile