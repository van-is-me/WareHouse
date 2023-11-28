import { useLocation, useParams } from "react-router-dom"
import WarehouseItem from '../components/WarehouseItem'
import { useEffect, useState } from "react"
import API from "../API"
import { useDispatch } from "react-redux"
import { changeLoadingState } from "../reducers/SystemReducer"
function WarehouseList() {
  const dispatch = useDispatch()
  const { name } = useParams()
  const [listWarehouse, setListWarehouse] = useState([])
  const location = useLocation()
  const { state } = location
  const { cateId } = state || {}
  useEffect(() => {
    dispatch(changeLoadingState(true))

    API.warehouseByCategory(cateId)
      .then(res => {
        dispatch(changeLoadingState(false))
        setListWarehouse(res.data.slice(0, 3))
      })
      .catch(err => { dispatch(changeLoadingState(false)) })
  }, [name])

  const revertText = () => {
    const finalName = name.replaceAll('-', ' ')
    return finalName
  }
  return (
    <div className="w-full bg-[#eeeeee] min-h-screen pt-10">
      <h1 className='text-[26px] lg:text-[47px] uppercase font-bold text-primary text-center'><span className='text-secondary'>
        {revertText()}
      </span>
      </h1>

      <div className='w-[80%] mx-auto grid grid-cols-12 gap-3'>
        {listWarehouse.length > 0 
        ? listWarehouse.map(item => (
          <div key={item.id} className='col-span-12 md:col-span-6 lg:col-span-4'>
            <WarehouseItem item={item} />
          </div>
        ))
      : <span className="col-span-12 text-center font-bold">Không có dữ liệu</span>}
      </div>
    </div>
  )
}

export default WarehouseList