import React, { useEffect, useState } from 'react'
import { changeLoadingState } from '../reducers/SystemReducer'
import { useDispatch } from 'react-redux'
import API from '../API'
import WarehouseItem from './WarehouseItem'
import noti from '../common/noti'

function ListWarehouseHome() {
    const dispatch = useDispatch()
  const [listWarehouse, setListWarehouse] = useState([])
    
  useEffect(() => {
    getListWarehouses()
  }, [])

  const getListWarehouses = () => {
    dispatch(changeLoadingState(true))
    API.warehouses()
      .then(res => {
        dispatch(changeLoadingState(false))
        setListWarehouse(res.data.slice(0, 3))
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
        noti.error(err.response?.data)
      })
  }
    return (
        <div className='w-full min-h-screen'>
            <div className='w-[60%] mx-auto flex items-center flex-col'>
                <h1 className='text-secondary font-bold text-[16px] md:text-[20px] lg:text-[26px] title-cus relative text-center uppercase'>Warehouse Bridge</h1>
                <h1 className='text-[26px] lg:text-[47px] uppercase font-bold text-primary'>kho <span className='text-secondary'>nổi bật</span></h1>
            </div>
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

export default ListWarehouseHome