import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { MantineReactTable } from 'mantine-react-table'
import { changeLoadingState } from "../../reducers/SystemReducer"
import API from "../../API"
import func from '../../common/func'
import { AiOutlineEdit } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import noti from "../../common/noti"
import FormBase from "../../components/FormBase"
import FormUpdate from "../../components/FormUpdate"
import { storage } from '../../firebase'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function AdminBlog() {
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [blogDetail, setBlogDetail] = useState({})
  const [isShowAdd, setIsShowAdd] = useState(false)
  const [isShowUpdate, setIsShowUpdate] = useState(false)
  const [cateList, setCateList] = useState([])
  const [formData, setFormData] = useState([
    { name: 'Tên', binding: 'name', type: 'input' },
    { name: 'Mô tả ngắn', binding: 'shortDescription', type: 'area' },
    { name: 'Mô tả chi tiết', binding: 'description', type: 'area' },
    { name: 'Ảnh', binding: 'image', type: 'file' },
    { name: 'Danh mục', binding: 'postCategoryId', type: 'select', options: [1, 2, 3], defaultValue: '' },
  ])

  useEffect(() => {
    fetchPostCategory()
    fetchList()

    // if (cateList.length > 0) {
    //   setFormData([
    //     { name: 'Tên', binding: 'name', type: 'input' },
    //     { name: 'Mô tả ngắn', binding: 'shortDescription', type: 'area' },
    //     { name: 'Mô tả chi tiết', binding: 'description', type: 'area' },
    //     { name: 'Ảnh', binding: 'image', type: 'file' },
    //     { name: 'Danh mục', binding: 'postCategoryId', type: 'select', options: cateList, defaultValue: cateList[0] },
    //   ])
    // }
  }, [])

  const fetchList = () => {
    dispatch(changeLoadingState(true))
    API.posts()
      .then(res => {
        dispatch(changeLoadingState(false))
        setList(res.data)
      })
      .catch(err => {
        dispatch(changeLoadingState(false))
      })
  }

  const fetchPostCategory = () => {
    API.postCategory()
      .then(res => {
        setCateList(res.data)
        if (res.data.length > 0) {
          setFormData([
            { name: 'Tên', binding: 'name', type: 'input' },
            { name: 'Mô tả ngắn', binding: 'shortDescription', type: 'area' },
            { name: 'Mô tả chi tiết', binding: 'description', type: 'area' },
            { name: 'Ảnh', binding: 'image', type: 'file' },
            { name: 'Danh mục', binding: 'postCategoryId', type: 'select', options: res.data, defaultValue: res.data[0] },
          ])
        }
      })
      .catch(err => { })
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
        accessorKey: 'name',
        header: 'Tên',
        size: 300
      },
      {
        accessorKey: 'fullnameAuthor',
        header: 'Tên tác giả',
      },
      {
        accessorKey: 'namePostCategory',
        header: 'Tên danh mục',
      },
      // {
      //   accessorKey: 'hashtagName',
      //   header: 'Hashtag',
      //   Cell: ({ cell, row }) => (
      //     <div>
      //       {
      //         cell.getValue() && cell.getValue().map(function (item, index) {
      //           return <span key={`demo_snap_${index}`}>{(index ? ', ' : '') + item}</span>
      //         })
      //       }
      //     </div>
      //   ),
      // },
      {
        accessorKey: 'creationDate',
        header: 'Ngày tạo',
        Cell: ({ cell, row }) => (
          <div>
            {func.convertDate(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: 'image',
        header: 'Ảnh',
        Cell: ({ cell, row }) => (
          <div>
            <img className="w-[148px] h-[82px]" src={cell.getValue()} alt="" />
          </div>
        ),
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

  const actionAdd = () => {
    setIsShowAdd(true)
  }
  const handleCancel = () => {
    setIsShowAdd(false)
    setIsShowUpdate(false)
  }

  const addBlog = async (data) => {
    const images = data.images
    if (images.length != 0) {
      dispatch(changeLoadingState(true))
      try {
        const imageUrls = await Promise.all(images.map(async (image) => {
          const imageName = `${new Date().getTime()}_${image.name}`
          const imageRef = ref(storage, `images/${imageName}`)
          await uploadBytes(imageRef, image)
          const imageUrl = await getDownloadURL(imageRef)
          return imageUrl
        }))

        API.addPost({
          postCategoryId: data.postCategory || cateList[0]?.id,
          name: data?.name,
          image: imageUrls[0],
          shortDescription: data?.shortDescription,
          description: data?.description
        })
          .then(res => {
            setIsShowAdd(false)
            fetchList()
            noti.success(res.data?.result, 3000)
          })
          .catch(err => {
            noti.error(err.response?.data, 3000)
          })
        dispatch(changeLoadingState(false))
      } catch (error) {
        console.log("Lỗi khi tải lên ảnh" + error, 3000);
      }
    } else noti.error('Bạn phải thêm ảnh để tạo blog!', 2500)

  }

  const getDetail = (data) => {
    setBlogDetail({
      id: data.original.id,
      postCategoryId: data.original.postCategoryId,
      name: data.original.name,
      image: [data.original.image],
      shortDescription: data.original.shortDescription,
      description: data.original.description
    })
    setIsShowUpdate(true)
  }

  const updateBlog = async (data) => {
    if (Array.isArray(data?.image)) {
      const imageUrls = []

      for (const imageItem of data.image) {
        if (imageItem instanceof File) {
          // Đây là một object File, bạn có thể tải lên Firebase Storage
          const imageName = `${new Date().getTime()}_${imageItem.name}`
          const imageRef = ref(storage, `images/${imageName}`)
          await uploadBytes(imageRef, imageItem)
          const imageUrl = await getDownloadURL(imageRef)
          imageUrls.push(imageUrl)
        } else if (typeof imageItem === 'string') {
          // Đây là một URL hình ảnh, bạn có thể xử lý nó tùy ý
          imageUrls.push(imageItem)
        }
      }
      // Bây giờ imageUrls sẽ chứa URL của tất cả các hình ảnh đã tải lên Firebase Storage.
      // có thể sử dụng imageUrls khi cần thiết.

      dispatch(changeLoadingState(true))
      API.updatePost({
        id: data?.id,
        postCategoryId: data?.postCategoryId,
        name: data?.name,
        image: imageUrls[0],
        shortDescription: data?.shortDescription,
        description: data?.description
      })
        .then(res => {
          noti.success(res.data?.result)
          dispatch(changeLoadingState(false))
          handleCancel()
          fetchList()
        })
        .catch(err => {
          noti.error(err?.response?.data?.errors[0])
          dispatch(changeLoadingState(false))
        })
    }
  }

  const handleDeleteRow = (row) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='bg-[#f7f7f7] rounded-md p-4 shadow-md'>
            <p className="text-[24px]">Bạn có chắc chắn muốn xoá bài <br /> 	&quot;{row.getValue('name')}&quot; ?</p>
            <div className="w-full flex justify-end mt-3">
              <button className="px-3 py-1 mr-2 rounded-md btn-cancel" onClick={onClose}>Huỷ</button>
              <button
                className="px-3 py-1 rounded-md btn-primary"
                onClick={() => {
                  deletePost(row.getValue('id'))
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

  const deletePost = (id) => {
    API.deletePost(id)
      .then(res => {
        fetchList()
        noti.success(res.data?.result)
      })
      .catch(err => {
        noti.error(err?.response?.data)
      })
  }
  return (
    <div className='w-full'>
      <div className=' w-full md:w-[90%] mx-auto mt-10'>
        <button className='btn-primary px-3 py-1 my-2' onClick={actionAdd}>Thêm</button>
        <MantineReactTable
          columns={columns}
          initialState={{ columnVisibility: { id: false } }}
          data={list}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className='flex items-center'>
              <button onClick={() => getDetail(row)} className=''><AiOutlineEdit className='edit-icon' /></button>
              <button onClick={() => handleDeleteRow(row)} className=''><MdDelete className='del-icon' /></button>
            </div>
          )}
        />
      </div>
      {isShowAdd
        ? <FormBase title={formData}
          onSubmit={addBlog}
          buttonName={'Thêm mới'}
          totalImage={1}
          onCancel={handleCancel} />
        : null}
      {isShowUpdate ?
        <FormUpdate
          title={formData}
          onSubmit={updateBlog}
          buttonName={'Chỉnh sửa'}
          initialData={blogDetail}
          onCancel={handleCancel}
          isUpdateImage={true}
          totalImage={1}
        />
        : null}
    </div>
  )
}

export default AdminBlog