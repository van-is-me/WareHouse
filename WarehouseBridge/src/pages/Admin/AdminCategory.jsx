import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { changeLoadingState } from "../../reducers/SystemReducer"
import API from "../../API"
import noti from "../../common/noti"
import FormBase from '../../components/FormBase';
import { MantineReactTable } from "mantine-react-table"
import { MdDelete } from 'react-icons/md'
import '../../css/AdminBody.css'
import { AiOutlineEdit } from "react-icons/ai"

function AdminCategory() {

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
    fetchListCategory()
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
    { name: 'Link hình ảnh', binding: 'imagerUrl', type: 'input' },
    { name: 'Tên hình ảnh', binding: 'name', type: 'input' },
  ])

  function fetchListCategory() {
    dispatch(changeLoadingState(true))
    API.categories()
      .then(res => {
        console.log(res);
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
        noti.error(err.response?.data)
      })
  }

  const addCategory = (data) => {
    const finalData = {
      imagerUrl: data.imagerUrl,
      name: data.name
    }
    API.addCategory(finalData)
      .then(res => {
        fetchListCategory()
        setIsShow(false)
        noti.success(res.data, 3000)
      })
      .catch(err => {
        noti.error(err.response?.data, 3000)
      })
  }

  const deleteCategory = () => {
    if (!rowToDelete) return;

    API.deleteCategory(rowToDelete.getValue("id"))
      .then((res) => {
        fetchListCategory();
        noti.success(res.data);
        closeDeleteConfirmation();
      })
      .catch((err) => {
        noti.error(err.response?.data);
        closeDeleteConfirmation();
      });
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
       
      }
    },
    [],
  );

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
        header: 'Tên hình ảnh',
      },
      {
        accessor: 'imagerUrl', // Access the array of images
        header: 'Link hình ảnh',
        Cell: ({ cell }) => (
          <img key={cell.row.original.imagerUrl} src={cell.row.original.imagerUrl} alt="imagerUrl" />
        ),
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
              <button onClick={() => table.setEditingRow(row)} className=''><AiOutlineEdit className='edit-icon' /></button>
              <button onClick={() => openDeleteConfirmation(row)} className="">
                <MdDelete className="del-icon" />
              </button>
            </div>
          )}
        />
      </div>
      {isShow ?
        <FormBase title={formData}
          onSubmit={addCategory}
          buttonName={'Thêm mới'}
          onCancel={handleCancel}
        /> : ''
      }
      {isDeleteConfirmationOpen && (
        <div className="overlay" onClick={closeDeleteConfirmation}>
          <div className="delete-confirmation-modal">
            <p>Bạn có chắc muốn xoá category {rowToDelete.getValue("name")}</p>
            <div className="button-confirmation-modal">
              <button className="confirm-button" onClick={deleteCategory}>Xác nhận</button>
              <button className="cancel-button" onClick={closeDeleteConfirmation}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default AdminCategory