import { confirmAlert } from 'react-confirm-alert'
import { Textarea } from "@mantine/core"
import 'react-confirm-alert/src/react-confirm-alert.css'
import { MantineReactTable } from 'mantine-react-table'
import { useMemo } from "react"
import { useEffect, useState } from "react"
import API from '../../API'
import func from '../../common/func'
import { useDispatch } from 'react-redux'
import { changeLoadingState } from '../../reducers/SystemReducer'
import noti from '../../common/noti'
import { storage } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

function AdminContract() {
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [orderList, setOrderList] = useState([])
  const [isShowAdd, setIsShowAdd] = useState(false)
  const [isShowUpdate, setIsShowUpdate] = useState(false)
  const [selectedContract, setSelectedContract] = useState({})
  const [orderIdSelected, setOrderIdSelected] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [fileContract, setFileContract] = useState('')
  const [description, setDescription] = useState('')
  const [urlContract, setUrlContract] = useState('')
  useEffect(() => {
    fetchList()
    fetchOrder()
  }, [])

  const fetchList = () => {
    dispatch(changeLoadingState(true))
    API.contractByAdmin()
      .then(res => {
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch(err => dispatch(changeLoadingState(false)))
  }

  const fetchOrder = () => {
    dispatch(changeLoadingState(true))
    API.getOrderAdmin()
      .then(res => {
        dispatch(changeLoadingState(false))
        setOrderList(res.data)
      })
      .catch(err => dispatch(changeLoadingState(false)))
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        Cell: ({ cell, row }) => (
          <div>
            ...
          </div>
        ),
      },
      {
        accessorKey: 'orderId',
        header: 'Order ID',
        Cell: ({ cell, row }) => (
          <div>
            ...
          </div>
        ),
      },
      {
        accessorKey: 'customer.userName',
        header: 'Tên người dùng',
      },
      {
        accessorKey: 'customer.email',
        header: 'Email',
      },
      {
        accessorKey: 'description',
        header: 'Mô tả',
      },
      {
        accessorKey: 'warehousePrice',
        header: 'Giá kho',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertVND(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: 'depositFee',
        header: 'Tiền cọc',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertVND(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: 'servicePrice',
        header: 'Phí dịch vụ',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertVND(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: 'file',
        header: 'File hợp đồng',
        // size: 800,
        Cell: ({ cell, row }) => (
          <div className='underline cursor-pointer' onClick={() => window.open(cell.getValue(), '_blank')}>
            Xem chi tiết
          </div>
        ),
      },
      {
        accessorKey: 'startTime',
        header: 'Ngày bắt đầu',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertDate(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: 'endTime',
        header: 'Ngày kết thúc',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertDate(cell.getValue())}
          </div>
        ),
      },

    ],
    [],
  )

  const cancelAll = () => {
    setIsShowAdd(false)
    setIsShowUpdate(false)
    setDescription('')
    setEndTime('')
    setFileContract('')
    setStartTime('')
    setOrderIdSelected('')
  }
  const actionAdd = () => {
    setIsShowAdd(true)
  }

  const addContract = () => {
    if (fileContract) {
      dispatch(changeLoadingState(true))
      const storageRef = ref(storage, `contracts/${Date.now() + fileContract.name}`)
      uploadBytes(storageRef, fileContract)
        .then((snapshot) => {
          getDownloadURL(storageRef)
            .then((downloadURL) => {
              dispatch(changeLoadingState(false))
              setUrlContract(downloadURL)
              API.addContract({
                orderId: orderIdSelected || orderList[0]?.id,
                startTime: startTime,
                endTime: endTime,
                file: downloadURL,
                description: description
              })
                .then(res => {
                  fetchList()
                  noti.success('Tạo mới hợp đồng thành công')
                  cancelAll()
                })
                .catch(err => {
                  noti.error(err.response?.data)
                })
            })
            .catch((error) => {
              dispatch(changeLoadingState(false))
              console.error('Error getting download URL:', error)
            })
        })
        .catch((error) => {
          console.error('Error uploading file:', error)
        })
    } else {
     noti.error('Bạn phải thêm 1 file PDF để hoàn thành việc tạo hợp đồng')
    }
  }
  const getDetail = (data) => {
    console.log(data);
    setSelectedContract(data.getValue('id'))
    setIsShowUpdate(true)
    setStartTime(data.getValue('startTime'))
    setEndTime(data.getValue('endTime'))
    setDescription(data.getValue('description'))
    setOrderIdSelected(data.getValue('orderId'))
    setUrlContract(data.getValue('file'))
    setFileContract(data.getValue('file'))
  }

  const updateContract = () => {
    if (selectedContract) {
      dispatch(changeLoadingState(true))

      if (fileContract instanceof File) {
        const storageRef = ref(storage, `contracts/${Date.now() + fileContract.name}`)

        uploadBytes(storageRef, fileContract)
          .then((snapshot) => {
            getDownloadURL(storageRef)
              .then((downloadURL) => {
                dispatch(changeLoadingState(false))
                setUrlContract(downloadURL)

                API.updateContract(selectedContract, {
                  startTime: startTime,
                  endTime: endTime,
                  file: downloadURL,
                  description: description,
                })
                  .then((res) => {
                    fetchList()
                    noti.success('Cập nhật hợp đồng thành công')
                    cancelAll()
                  })
                  .catch((err) => {
                    noti.error(err.response?.data)
                  })
              })
              .catch((error) => {
                dispatch(changeLoadingState(false))
                console.error('Error getting download URL:', error)
              })
          })
          .catch((error) => {
            dispatch(changeLoadingState(false))
            console.error('Error uploading file:', error)
          })
      } else {
        API.updateContract(selectedContract, {
          startTime: startTime,
          endTime: endTime,
          file: urlContract,
          description: description,
        })
          .then((res) => {
            dispatch(changeLoadingState(false))
            fetchList()
            noti.success('Cập nhật hợp đồng thành công')
            cancelAll()
          })
          .catch((err) => {
            dispatch(changeLoadingState(false))
            noti.error(err.response?.data)
          })
      }
    } else {
      console.error('No contract selected for update')
    }
  }


  return (
    <div className='w-full'>
      <div className=' w-full md:w-[90%] mx-auto mt-10'>
        <button className='btn-primary px-3 py-1 my-2' onClick={actionAdd}>Thêm</button>
        <MantineReactTable
          columns={columns}
          data={list}
          initialState={{ columnVisibility: { id: false, orderId: false } }}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className='flex items-center'>
              <button onClick={() => getDetail(row)} className=''><AiOutlineEdit className='edit-icon' /></button>
              {/* <button onClick={() => handleDeleteRow(row)} className=''><MdDelete className='del-icon' /></button> */}
            </div>
          )}
        />
      </div>
      {isShowAdd
        ?
        <div className='bg-fog-cus'>
          <div className='hide-scroll bg-white p-4 rounded-lg w-[95%] md:w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-scroll'>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>File</label>
              <input
                type='file'
                onChange={(e) => setFileContract(e.target.files[0])}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Ngày bắt đầu</label>
              <input
                type='datetime-local'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Ngày kết thúc</label>
              <input
                type='datetime-local'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Mô tả</label>
              <Textarea
                className={` w-full md:w-[50%]`}
                rows={10}
                cols={20}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Đơn hàng</label>
              <select
                value={orderIdSelected}
                onChange={(e) => setOrderIdSelected(e.target.value)}
              >
                {orderList.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.id}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-[80%] flex items-center mx-auto mt-3 justify-between'>
              <button className='btn-cancel px-3 py-1' onClick={cancelAll}>Huỷ</button>
              <button className='btn-primary px-3 py-1' onClick={addContract}>Lưu</button>
            </div>
          </div>
        </div>
        : null}

      {isShowUpdate
        ?
        <div className='bg-fog-cus'>
          <div className='hide-scroll bg-white p-4 rounded-lg w-[95%] md:w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-scroll'>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>File</label>
              <input
                type='file'
                onChange={(e) => setFileContract(e.target.files[0])}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Ngày bắt đầu</label>
              <input
                type='datetime-local'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Ngày kết thúc</label>
              <input
                type='datetime-local'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Mô tả</label>
              <Textarea
                className={` w-full md:w-[50%]`}
                rows={10}
                cols={20}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>
            </div>
            {/* <div className='flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between'>
              <label>Đơn hàng</label>
              <select
                value={orderIdSelected}
                onChange={(e) => setOrderIdSelected(e.target.value)}
              >
                {orderList.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.id}
                  </option>
                ))}
              </select>
            </div> */}
            <div className='w-[80%] flex items-center mx-auto mt-3 justify-between'>
              <button className='btn-cancel px-3 py-1' onClick={cancelAll}>Huỷ</button>
              <button className='btn-primary px-3 py-1' onClick={updateContract}>Cập nhật</button>
            </div>
          </div>
        </div>
        : null}
    </div>
  )
}

export default AdminContract