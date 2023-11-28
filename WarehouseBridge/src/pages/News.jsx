import '../css/News.css'
import { FaUserAlt } from 'react-icons/fa'
import { BsFillCalendarDateFill, BsFillCaretLeftSquareFill, BsFillCaretRightSquareFill } from 'react-icons/bs'
import { BiLogoFacebook, BiLogoInstagramAlt, BiLogoTwitter, BiSearch } from 'react-icons/bi'
import LoadingLocal from '../components/LoadingLocal'
import { useEffect, useState } from 'react'
import { changeLoadingState } from "../reducers/SystemReducer"
import API from '../API'
import noti from '../common/noti'
import { useDispatch } from 'react-redux'

function News() {
  const dispatch = useDispatch();
  const [listNews, setListNews] = useState([])
  const [listHastag, setListHastag] = useState([])
  const [listProviders, setListProviders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newsPerPage, setNewPerPage] = useState(5)
  const [listPerPage, setListPerPage] = useState([])
  const [totalPage, setTotalPage] = useState([])


  useEffect(() => {
    fetchListPost()
    fetchListProvider()
    fetchListPostHastag()
  }, [])

  function fetchListPost() {
    dispatch(changeLoadingState(true))
    API.posts()
      .then(res => {
        dispatch(changeLoadingState(false))
        getByPage(res.data)
        setListNews(res.data)
        const tmpTotal = Math.round(res.data.length / newsPerPage)
        let listOfPage = []
        for (let i = 1; i <= tmpTotal; i++) {
          listOfPage.push(i)
        }
        setTotalPage(listOfPage)
      })
      .catch((err) => {
        noti.error(err.response?.data)
        dispatch(changeLoadingState(false))
      })
  }

  function fetchListPostHastag() {
    dispatch(changeLoadingState(true))
    API.getHastags()
      .then(res => {
        dispatch(changeLoadingState(false))
        setListHastag(res.data)
      })
      .catch((err) => {
        noti.error(err.response?.data)
        dispatch(changeLoadingState(false))
      })
  }

  function fetchListProvider() {
    dispatch(changeLoadingState(true))
    API.providerWareHourse()
      .then(res => {
        dispatch(changeLoadingState(false))
        setListProviders(res.data)
      })
      .catch((err) => {
        noti.error(err.response?.data)
        dispatch(changeLoadingState(false))
      })
  }

  const getByPage = (listData = [], currentPage = 1) => {
    const indexOfLastNews = currentPage * newsPerPage
    const indexOfFirstNews = indexOfLastNews - newsPerPage
    const current = listData.slice(indexOfFirstNews, indexOfLastNews)
    setListPerPage(current)
  }

  const next = () => {
    let tmpPage = currentPage + 1
    if (tmpPage > listNews.length) {
      setCurrentPage(1)
      getByPage(listNews, 1)
    } else {
      setCurrentPage(currentPage + 1)
      getByPage(listNews, currentPage + 1)
    }
  }

  const pre = () => {
    let tmpPage = currentPage - 1
    if (tmpPage < 1) {
      setCurrentPage(1)
      getByPage(listNews, 1)
    } else {
      setCurrentPage(currentPage - 1)
      getByPage(listNews, currentPage - 1)
    }
  }

  const clickToPage = (page) => {
    setCurrentPage(page)
    getByPage(listNews, page)
  }

  // const listTag = [
  //   'Kho', 'Kho tự quản', 'Kho mini', 'Kho khô', 'Kho lạnh', 'Warehouse', 'Kho lưu trữ', 'Thùng', 'Nhà kho', 'Bài viết'
  // ]
  return (
    <div className="w-full min-h-screen">

      <div className="w-[90%] mx-auto mt-14 flex items-start justify-between flex-wrap">
        {/* half 1 */}
        <div className="w-full md:w-[60%] flex flex-wrap justify-center items-center">
          {listPerPage.map(item => (
            <div key={item.namePostCategory} className="w-full flex items-start my-3 p-2 bg-gray-200 md:bg-white">
              <div className="h-[300px] w-[400px] hidden lg:block relative overflow-hidden mr-4">
                <img src={item.image} alt="" className="object-cover absolute w-full top-0 left-0 h-full" />
              </div>
              <div className='w-full'>
                <p className="bg-secondary px-4 py-2 text-white w-auto">{item.name}</p>
                <div className='flex items-center w-full justify-start flex-wrap my-3'>
                  <p className='flex mr-4 items-center text-[18px] my-2 text-[#666]'><FaUserAlt className='text-secondary' />&nbsp; {item.fullnameAuthor}</p>
                  <p className='flex items-center text-[18px] my-2 text-[#666]'>
                    <BsFillCalendarDateFill className='text-secondary' />&nbsp; {item.creationDate}
                  </p>
                </div>
                <p className='text-primary text-[24px] cursor-pointer hover:underline'>{item.shortDescription}</p>
                <hr className='mt-5' />
                <div className='w-full flex justify-between items-center mt-5'>
                  <button className='btn-secondary px-2 md:px-5 py-1 md:py-2'>Đọc thêm</button>
                  <div className='flex items-center justify-around'>
                    <span className='text-[#666]'>Chia sẻ:</span>
                    <BiLogoFacebook className='text-secondary cursor-pointer text-[24px] mx-2' />
                    <BiLogoInstagramAlt className='text-secondary cursor-pointer text-[24px] mx-2' />
                    <BiLogoTwitter className='text-secondary cursor-pointer text-[24px] mx-2' />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* paginate */}
          <div className='w-full md:w-[50%] flex items-center justify-center'>
            <button onClick={pre} className='text-[30px] text-primary mx-2 w-[40px] h-[40px] flex items-center justify-center'><BsFillCaretLeftSquareFill /></button>
            {totalPage.map(item => (
              <button onClick={() => clickToPage(item)} key={item} className={`text-[20px] text-primary mx-2 w-[30px] h-[30px] flex items-center justify-center ${currentPage == item ? 'active-p' : ''}`}>{item}</button>
            ))}
            {totalPage.length == 0
              ? <button className={`text-[20px] text-primary mx-2 w-[30px] h-[30px] flex items-center justify-center active-p`}>
                1
              </button>
              : null}
            <button onClick={next} className='text-[30px] text-primary mx-2 w-[40px] h-[40px] flex items-center justify-center'><BsFillCaretRightSquareFill /></button>
          </div>
        </div>

        {/* half 2 */}
        <div className="w-full md:w-[38%] mt-24 md:mt-0">
          <div className='items-center w-full hidden md:flex'>
            <input type="text" className='input-cus bg-[#eeeeee] h-[50px] px-4 w-[80%]' placeholder='Tìm kiếm tin tức' />
            <button className='btn-secondary h-[50px] w-[20%] flex justify-center items-center'><BiSearch className='' /></button>
          </div>

          <div className='w-full mt-5'>
            <p className='text-primary text-[22px] md:text-[30px] font-bold'>Kho</p>
            {listProviders.map(wh => (
              <div key={wh.name} className='flex items-center justify-between my-4 text-[#666] text-[18px]'>
                <span className='hover:underline cursor-pointer'>{wh.name}</span>
                <span>{wh.warehousesCount}</span>
              </div>
            ))}
          </div>
          <div className='w-full mt-10'>
            <h1 className='text-[22px] lg:text-[30px] text-primary font-bold'>Các bài đăng gần đây</h1>
            <div className='w-full my-5'>
              {listNews.map(i2 => (
                <div key={i2.namePostCategory} className='w-full flex flex-wrap my-2'>
                  <div className='w-[100px] h-[100px] overflow-hidden relative hidden lg:block'>
                    <img src={i2.image} className='w-full object-cover absolute top-0 left-0 h-full' alt="" />
                  </div>
                  <div className='w-full bg-gray-200 p-2 lg:bg-white lg:w-[70%] ml-0 md:ml-2'>
                    <p title={i2.name} className='text-[20px] text-primary cursor-pointer hover:underline truncate-text'>{i2.name}</p>
                    <div className='flex items-start w-full justify-start flex-wrap my-3 flex-col'>
                      <p className='flex mr-4 items-center text-[18px] text-[#666]'>
                        <FaUserAlt className='text-secondary' />&nbsp; {i2.fullnameAuthor}
                      </p>
                      <p className='flex items-center text-[18px] text-[#666]'>
                        <BsFillCalendarDateFill className='text-secondary' />&nbsp; {i2.creationDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className='w-full mt-10'>
            <h1 className='text-[22px] lg:text-[30px] text-primary font-bold'>Các bài đăng khác</h1>
            <div className='w-full my-5'>
              {listNews.map(i2 => (
                <div key={i2.namePostCategory} className='w-full flex flex-wrap my-2'>
                  <div className='w-[100px] h-[100px] overflow-hidden relative hidden lg:block'>
                    <img src={i2.image} className='w-full object-cover absolute top-0 left-0 h-full' alt="" />
                  </div>
                  <div className='w-full bg-gray-200 p-2 lg:bg-white lg:w-[70%] ml-0 md:ml-2'>
                    <p title={i2.name} className='text-[20px] text-primary cursor-pointer hover:underline truncate-text'>{i2.name}</p>
                    <div className='flex items-start w-full justify-start flex-wrap my-3 flex-col'>
                      <p className='flex mr-4 items-center text-[18px] text-[#666]'>
                        <FaUserAlt className='text-secondary' />&nbsp; {i2.fullnameAuthor}
                      </p>
                      <p className='flex items-center text-[18px] text-[#666]'>
                        <BsFillCalendarDateFill className='text-secondary' />&nbsp; {i2.creationDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='w-full my-10'>
            <h1 className='text-[30px] text-primary font-bold'>Gắn thẻ</h1>
            <div className='w-full flex justify-around items-center flex-wrap'>
              {listHastag.map(tag => (
                <button className='my-2 px-4 py-2 text-primary border-gray-300 border-[1px] border-solid' key={tag.id}>{tag.hashtagName}</button>
              ))}
            </div>
          </div>



        </div>
      </div>
    </div>
  )
}

export default News