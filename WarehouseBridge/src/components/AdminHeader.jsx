import { useDispatch } from 'react-redux'
import logo from '../assets/images/fav.png'
import { Menu } from '@headlessui/react'
import { authen, setRole } from '../reducers/UserReducer'
import noti from '../common/noti'
import menus from '../common/menus'
import '../css/AdminHeader.css'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
function AdminHeader() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [curTab, setCurTab] = useState('warehouses')
    const menu = menus.adminMenu()

    useEffect(() => {
        const curPathName = location.pathname.substring(7)
        const matchedMenuItem = menu.find(item => item.path === curPathName)
        handleResize()
        if (matchedMenuItem) setCurTab(matchedMenuItem.name)
        else setCurTab('')

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [location.pathname, menu])

    const handleResize = () => {
        // if (window.innerWidth > 767) setWindowWidth(window.innerWidth - 60)
        // else setWindowWidth(window.innerWidth)
        setWindowWidth(window.innerWidth - 60)
    }

    function logout() {
        dispatch(authen(null))
        dispatch(setRole(null))
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        noti.success('Đăng xuất thành công')
    }

    function changeRoute(route, path) {
        navigate(`/admin/${path}`)
        setCurTab(route)
    }
    return (
        <div className={`shadow-lg float-right`} style={{ width: `${windowWidth}px` }}>
            <div className="bg-white flex justify-end md:justify-between px-5">
                <div className='w-[18%] flex items-center'>
                    <img src={logo} alt="" className='w-full hidden md:block' />
                </div>
                <div className='w-[20%] h-[100px] relative'>
                    <Menu>
                        <Menu.Button className="absolute top-[50%] translate-y-[-50%] bottom-0 right-0 md:right-5 flex items-center justify-center cursor-pointer text-[16px] text-white overflow-hidden w-[60px] h-[60px]">
                            <img src='https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg' className='rounded-full object-fill' alt='' />
                        </Menu.Button>
                        <Menu.Items className="absolute top-[80%] min-w-[150px] right-2 md:right-8 flex flex-col items-end bg-gray-100 text-black py-1 shadow-md">
                            <Menu.Item>
                                {({ active }) => (
                                    <p
                                        className={`${active ? 'bg-[#fea116] text-white p-1 cursor-pointer w-full text-right' : 'p-1 cursor-pointer w-full text-right'}`}
                                        onClick={logout}>
                                        Đăng xuất
                                    </p>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
            <hr />
            {/* menu */}
            {/* <div className='w-full md:hidden mx-auto flex justify-around items-center py-4 overflow-y-scroll hide-scroll pl-[150px] sm:pl-0'>
                {menu.map((i) => (
                    <div key={i.name} onClick={() => changeRoute(i.name, i.path)} className={`w-[150px] hv-bg mx-4 uppercase hover:cursor-pointer bg-[#f3f0f0] text-center p-2 ${curTab == i.name ? 'active' : ''}`}>
                        {i.name}
                    </div>
                ))}
            </div> */}
        </div>
    )
}

export default AdminHeader