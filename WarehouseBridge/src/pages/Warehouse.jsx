import { useEffect, useState } from "react"
import WarehouseItem from "../components/WarehouseItem"
import API from '../API'
import { useDispatch } from "react-redux"
import noti from '../common/noti'
import { changeLoadingState } from '../reducers/SystemReducer'
function Warehouse() {
  const dispatch = useDispatch()
  const [listWarehouse, setListWarehouse] = useState([])

  useEffect(() => {
    dispatch(changeLoadingState(true))
    API.warehouses()
      .then(res => {
        dispatch(changeLoadingState(false))
        setListWarehouse(res.data)
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
        noti.error(err.response?.data)
      })

  }, [])
  return (
    <div className="w-full bg-[#eeeeee] min-h-screen pt-10">
      <h1 className='text-[26px] lg:text-[47px] uppercase font-bold text-primary text-center'>Tất cả <span className='text-secondary'>loại kho</span></h1>

      <div className='w-[80%] mx-auto grid grid-cols-12 gap-3'>
        {listWarehouse.map(item => (
          <div key={item.id} className='col-span-12 md:col-span-6 lg:col-span-4'>
            <WarehouseItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Warehouse