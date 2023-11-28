import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { changeLoadingState } from "../../reducers/SystemReducer"
import API from "../../API"
import noti from "../../common/noti"
import FormBase from "../../components/FormBase";
import { MantineReactTable } from "mantine-react-table"
import { MdDelete } from 'react-icons/md'
import '../../css/AdminBody.css'


function AdminPartner() {
  const dispatch = useDispatch()

  const [list, setList] = useState([])

  const [isShow, setIsShow] = useState(false)

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const [rowToDelete, setRowToDelete] = useState(null);

  const handleCancel = () => {
    setIsShow(false)
  }

  const actionAdd = () => {
    setIsShow(true)
  }

  useEffect(() => {
    fetchListProvider()
  }, [])

  const openDeleteConfirmation = (row) => {
    setIsDeleteConfirmationOpen(true);
    setRowToDelete(row);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setRowToDelete(null);
  };

  const [formData, setFormData] = useState([
    { name: 'Tên', binding: 'name', type: 'input' },
    { name: 'Email', binding: 'email', type: 'input' },
    { name: 'Số điện thoại', binding: 'phone', type: 'input' },
    { name: 'Link hình ảnh', binding: 'image', type: 'input' },
    { name: 'Mô tả ngắn', binding: 'shortDescription', type: 'input' },
    { name: 'Mô tả', binding: 'description', type: 'input' },
    { name: 'Địa chỉ', binding: 'address', type: 'input' },
  ])

  function fetchListProvider() {
    dispatch(changeLoadingState(true))
    API.providers()
      .then(res => {
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
        noti.error(err.response?.data)
      })
  }

  const addProvider = (data) => {
    const finalData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      image: data.image,
      shortDescription: data.shortDescription,
      description: data.description,
      address: data.address,
    }
    API.addProvider(finalData)
      .then(res => {
        fetchListProvider()
        setIsShow(false)
        noti.success(res.data, 3000)
      })
      .catch(err => {
        noti.error(err.response?.data, 3000)
      })
  }

  const deleteProvider = () => {
    if (!rowToDelete) return;

    API.deleteProvider(rowToDelete.getValue("id"))
      .then((res) => {
        fetchListProvider();
        noti.success(res.data);
        closeDeleteConfirmation();
      })
      .catch((err) => {
        noti.error(err.response?.data);
        closeDeleteConfirmation();
      });
  };


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
        accessorKey: 'name',
        header: 'Tên'
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Số điện thoại',
      },
      {
        accessor: 'image', // Access the array of images
        header: 'Link hình ảnh',
        Cell: ({ cell }) => (
          <img key={cell.row.original.image} src={cell.row.original.image} alt="image" />
        ),
      }, 
      {
        accessorKey: 'address',
        header: 'Địa chỉ',
      },
      {
        accessorKey: 'shortDescription',
        header: 'Mô tả ngắn',
        size: 300
      },
      {
        accessorKey: 'description',
        header: 'Mô tả',
        size: 1000
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
          data={list}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className='flex items-center'>
              {/* <button onClick={() => table.setEditingRow(row)} className=''><AiOutlineEdit className='edit-icon' /></button> */}
              <button onClick={() => openDeleteConfirmation(row)} className="">
                <MdDelete className="del-icon" />
              </button>
            </div>
          )}
        />
      </div>
      {isShow ?
        <FormBase title={formData}
          onSubmit={addProvider}
          buttonName={'Thêm mới'}
          onCancel={handleCancel}
        /> : ''
      }
      {isDeleteConfirmationOpen && (
        <div className="overlay" onClick={closeDeleteConfirmation}>
          <div className="delete-confirmation-modal">
            <p>Bạn có chắc muốn xoá đối tác tên {rowToDelete.getValue("name")} không?</p>
            <div className="button-confirmation-modal">
              <button className="confirm-button" onClick={deleteProvider}>Xác nhận</button>
              <button className="cancel-button" onClick={closeDeleteConfirmation}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPartner