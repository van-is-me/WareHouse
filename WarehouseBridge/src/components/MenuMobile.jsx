import { useEffect, useState } from "react"
import logoImg from '../assets/images/fav.png'
import menus from "../common/menus"
import { useLocation, useNavigate } from "react-router-dom"
function MenuMobile({ isOpen, setIsShowMenuMobile }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [mainMenu, setMainMenu] = useState(menus.mainMenu)
    const [curRoute, setCurRoute] = useState('home')

    function changeRoute(routeName) {
        if (routeName == '') setCurRoute('home')
        else setCurRoute(routeName)
        setIsShowMenuMobile(!isOpen)
        navigate(routeName)
    }

    const handleParentClick = () => {
        setIsShowMenuMobile(false)
    };
    const handleChildClick = (event) => {
        event.stopPropagation()
    };

    useEffect(() => {
        const currentPathname = location.pathname.substring(1)
        const matchedMenuItem = mainMenu.find(item => item.pathName === currentPathname)

        if (matchedMenuItem) setCurRoute(matchedMenuItem.name)
        else setCurRoute('')

    }, [location.pathname, mainMenu])


    return (
        <div className="w-full z-10 fixed top-0 left-0 right-0 bottom-0 bg-black/60" onClick={handleParentClick}>
            <div className="w-[70%] md:w-[40%] bg-primary h-[100vh] text-white pt-4" onClick={handleChildClick}>
                <img src={logoImg} className="w-[80%] mx-auto" alt="" />
                <ul className="w-full flex flex-col items-start uppercase mt-5">
                    {mainMenu.map(item => (
                        <li onClick={() => changeRoute(item.pathName)} className={`text-[14px] cursor-pointer hover:bg-[#fea116] w-full my-2 pl-4 py-2 md:text-[16px] hover:text-white ${curRoute == item.name ? 'bg-secondary' : ''}`} key={item.name}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default MenuMobile