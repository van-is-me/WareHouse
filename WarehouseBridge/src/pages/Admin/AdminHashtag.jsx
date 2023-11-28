import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { changeLoadingState } from "../../reducers/SystemReducer"
import API from "../../API"
import noti from "../../common/noti"
import FormBase from '../../components/FormBase';
import { MantineReactTable } from "mantine-react-table"
import { MdDelete } from 'react-icons/md'
import FormUpdate from '../../components/FormUpdate'
import '../../css/AdminBody.css'
import { AiOutlineEdit } from "react-icons/ai"
import { confirmAlert } from 'react-confirm-alert'

function AdminHashtag() {

  useEffect(() => {
    fetchListHastag()
  }, [])

  const [isShow, setIsShow] = useState(false)

  const [isShowUpdate, setIsShowUpdate] = useState(false)

  const dispatch = useDispatch()

  const [list, setList] = useState([])

  const [detailHastag, setDetailHastag] = useState(null)

  const actionAdd = () => {
    setIsShow(true)
  }

  const handleCancel = () => {
    setIsShow(false)
    setIsShowUpdate(false)
  }

  const [formData, setFormData] = useState([
    { name: 'Tên', binding: 'hashtagName', type: 'input' },
  ])

  function fetchListHastag() {
    dispatch(changeLoadingState(true))
    API.getHastags()
      .then(res => {
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
        noti.error(err.response?.data)
      })
  }

  const addHastag = (data) => {
    const finalData = {
      hashtagName: data.hashtagName,

    }
    API.addHastag(finalData)
      .then(res => {
        fetchListHastag()
        setIsShow(false)
        noti.success(res.data, 3000)
      })
      .catch(err => {
        noti.error(err.response?.data, 3000)
      })
  }

  const updateHastag = (data) => {
    dispatch(changeLoadingState(true))
    API.updateHastag({
      id: data?.id,
      hashtagName: data?.hashtagName,
    })
      .then(res => {
        handleCancel()
        dispatch(changeLoadingState(false))
        fetchListHastag()
        noti.success(res.data)
      })
      .catch(err => {
        noti.error(err?.response?.data?.errors[0])
        dispatch(changeLoadingState(false))
      })
  }

  const getDetailHastag = (data) => {
    setDetailHastag({
      id: data.original.id,
      hashtagName: data.original.hashtagName,
    })
    setIsShowUpdate(true)
  }

  const handleDeleteRow = (data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='bg-[#f7f7f7] rounded-md p-4 shadow-md'>
            <p className="text-[24px]">Bạn có chắc chắn muốn xoá <br /> 	&quot;{data.getValue('hashtagName')}&quot; ?</p>
            <div className="w-full flex justify-end mt-3">
              <button className="px-3 py-1 mr-2 rounded-md btn-cancel" onClick={onClose}>Huỷ</button>
              <button
                className="px-3 py-1 rounded-md btn-primary"
                onClick={() => {
                  deleteHastag(data.getValue('id'))
                  onClose()
                }}
              >
                Xoá
              </button>
            </div>
          </div>
        )
      }
    })
  }

  const deleteHastag = (id) => {
    API.deleteHastag(id)
      .then(res => {
        fetchListHastag()
        noti.success(res.data)
      })
      .catch(err => {
        noti.error(err.response?.data)
      })
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
        accessorKey: 'hashtagName',
        header: 'Tên'
      },
      {
        accessorKey: 'creationDate',
        header: 'Create Date',
      },
    ],
    [],
  )

  return (
    <div className='w-full'>
      <div className=' w-full md:w-[90%] mx-auto mt-10'>
        <button className='btn-primary px-3 py-1 my-2' onClick={actionAdd} >Thêm mới</button>
        <MantineReactTable
          columns={columns}
          initialState={{ columnVisibility: { id: false } }}
          data={list}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className='flex items-center'>
              <button onClick={() => getDetailHastag(row)} className=''><AiOutlineEdit className='edit-icon' /></button>
              <button onClick={() => handleDeleteRow(row)} className=''><MdDelete className='del-icon' /></button>
            </div>
          )}
        />
      </div>
      {isShowUpdate ?
        <FormUpdate
          title={formData}
          buttonName={'Chỉnh sửa'}
          initialData={detailHastag}
          onSubmit={updateHastag}
          onCancel={handleCancel}
        />
        : null}
      {isShow ?
        <FormBase title={formData}
          onSubmit={addHastag}
          buttonName={'Thêm mới'}
          onCancel={handleCancel}
        /> : ''
      }
    </div>
  )
}

export default AdminHashtag