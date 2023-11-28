import { useEffect, useState, Fragment, useRef, useCallback } from "react";
import logoImg from "../assets/images/logo/11zon_cropped.png";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillMail, AiFillPhone } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoYoutube,
  BiLogoTwitter,
} from "react-icons/bi";
import menus from "../common/menus";
import { authen, setRole } from "../reducers/UserReducer";
import MenuMobile from "./MenuMobile";
import noti from "../common/noti";
import API from "../API";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
function Header() {
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [mainMenu, setMainMenu] = useState(menus.mainMenu);
  const [curRoute, setCurRoute] = useState("home");
  const [isShowMenuMobile, setIsShowMenuMobile] = useState(false);
  const [listCate, setListCate] = useState([]);

  useEffect(() => {
    const currentPathname = location.pathname.substring(1);
    const pathSegments = currentPathname.split("/");
    const matchedMenuItem = mainMenu.find(
      (item) => item.pathName === pathSegments[0]
    );

    if (matchedMenuItem) setCurRoute(matchedMenuItem.name);
    else setCurRoute("");
    API.categories()
      .then((res) => {
        setListCate(res.data);
      })
      .catch((err) => {});
  }, [location.pathname]);

  function changeRoute(routeName) {
    if (routeName == "") setCurRoute("home");
    else setCurRoute(routeName);
    navigate(routeName);
  }

  function gotoSubRoute(routeName, param, id) {
    navigate(`/${routeName}/${param}`, {
      state: {
        cateId: id,
      },
    });
  }

  function hiddenMenu() {
    setIsShowMenuMobile(false);
  }

  function showMenu() {
    setIsShowMenuMobile(true);
  }

  function logout() {
    dispatch(authen(null));
    dispatch(setRole(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
    noti.success("Đăng xuất thành công");
  }
  return (
    <div className="w-full flex h-[80px] lg:h-[120px] sticky top-0 left-0 right-0 z-50">
      {isShowMenuMobile ? (
        <MenuMobile
          isOpen={isShowMenuMobile}
          setIsShowMenuMobile={setIsShowMenuMobile}
        />
      ) : (
        ""
      )}
      <div className="w-full lg:w-[20%] flex items-center justify-between relative lg:justify-center bg-primary px-2 py-4">
        <img src={logoImg} alt="" className="hidden lg:block w-[100px]" />
        {user.auth == null ? (
          <div
            onClick={() => changeRoute("login")}
            className="bg-secondary flex items-center justify-center cursor-pointer px-4 md:px-14 text-[12px] md:text-[16px] h-full text-white duration-150 lg:hidden border-[1px] border-solid border-[#fea116] hover:bg-[#0f1728]"
          >
            ĐĂNG NHẬP
          </div>
        ) : (
          <div className="absolute top-[50%] translate-y-[-50%] left-4 w-[50px] h-[50px] block lg:hidden">
            <Menu>
              <Menu.Button className="flex items-center justify-center cursor-pointer text-[16px] text-white overflow-hidden w-[50px] h-[50px]">
                <img
                  src={
                    user.auth?.avatar
                      ? user.auth?.avatar
                      : "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                  }
                  className="rounded-full object-fill"
                  alt=""
                />
              </Menu.Button>
              <Menu.Items className="absolute top-[105%] w-[150px] left-0 flex flex-col bg-white text-black py-1 shadow-md">
                <span className="text-[#999] ml-2">
                  {" "}
                  Xin chào {user.auth?.username}
                </span>
                <Menu.Item>
                  {({ active }) => (
                    <p
                      className={`${
                        active
                          ? "bg-[#fea116] text-white p-1 cursor-pointer w-full text-left"
                          : "p-1 cursor-pointer w-full text-left"
                      }`}
                      onClick={() => navigate("/profile")}
                    >
                      Thông tin cá nhân
                    </p>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <p
                      className={`${
                        active
                          ? "bg-[#fea116] text-white p-1 cursor-pointer w-full text-left"
                          : "p-1 cursor-pointer w-full text-left"
                      }`}
                      onClick={logout}
                    >
                      Đăng xuất
                    </p>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        )}
        <div className="block lg:hidden absolute top-[50%] translate-y-[-50%] right-4">
          {isShowMenuMobile ? (
            <MdClose
              onClick={hiddenMenu}
              className="text-[#fea116] text-[30px] md:text-[40px] cursor-pointer"
            />
          ) : (
            <HiMenu
              className="text-[#fea116] text-[30px] md:text-[40px] cursor-pointer"
              onClick={showMenu}
            />
          )}
        </div>
      </div>
      <div className="w-[80%] hidden lg:flex flex-col h-full">
        <div className="w-full flex justify-between px-3 py-2 bg-white">
          <p className="flex items-center text-[20px] text-[#666565]">
            <AiFillMail className="text-[#fea116]" />
            &nbsp;warehousebridge.service@gmail.com
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <AiFillPhone className="text-[#fea116]" />
            &nbsp;+0975688774
          </p>
          <div className="flex flex-wrap text-[24px] items-center">
            <BiLogoFacebook
              onClick={() =>
                window.open(
                  "https://www.facebook.com/profile.php?id=61551608820562",
                  "_blank"
                )
              }
              className="text-[#fea116] hover:text-[#fea116c8] cursor-pointer mx-1"
            />
            {/* <BiLogoInstagram className="text-[#fea116] hover:text-[#fea116c8] cursor-pointer mx-1" />
            <BiLogoTwitter className="text-[#fea116] hover:text-[#fea116c8] cursor-pointer mx-1" />
            <BiLogoYoutube className="text-[#fea116] hover:text-[#fea116c8] cursor-pointer mx-1" /> */}
          </div>
        </div>

        <div className="flex relative top-0 left-0 bg-primary h-full items-center uppercase text-white">
          {mainMenu.map((item) => (
            <div
              key={item.name}
              onMouseEnter={() => {
                const updatedMainMenu = mainMenu.map((menuItem) => {
                  if (menuItem.name === item.name) {
                    return { ...menuItem, isActive: true };
                  } else {
                    return menuItem;
                  }
                });
                setMainMenu(updatedMainMenu);
              }}
              onMouseLeave={() => {
                const updatedMainMenu = mainMenu.map((menuItem) => {
                  if (menuItem.name === item.name) {
                    return { ...menuItem, isActive: false };
                  } else {
                    return menuItem;
                  }
                });
                setMainMenu(updatedMainMenu);
              }}
              className={`text-[16px] mx-2  relative ${
                curRoute == item.name ? "text-[#fea116]" : ""
              }`}
            >
              <span
                onClick={() => changeRoute(item.pathName)}
                className="hover:text-[#fea116] cursor-pointer"
              >
                {item.title}
              </span>
              <div
                className={`absolute top-[100%] left-[50%] text-primary bg-white shadow-lg w-[200%] ${
                  item.isActive && item.params.length > 0 ? "block" : "hidden"
                }`}
              >
                {listCate.map((c) => (
                  <div
                    onClick={() => gotoSubRoute(item.pathName, c.name, c.id)}
                    className="hover:text-[#fea116] hover:bg-[#c4cee4] p-2 text-[14px] cursor-pointer"
                    key={c.name}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {user.auth == null ? (
            <div
              onClick={() => changeRoute("login")}
              className="absolute top-0 bottom-0 right-0 bg-secondary flex items-center justify-center cursor-pointer px-14 text-[16px] text-white duration-150"
            >
              đăng nhập
            </div>
          ) : (
            <div>
              <Menu>
                <Menu.Button className="absolute top-[50%] translate-y-[-50%] bottom-0 right-5 flex items-center justify-center cursor-pointer text-[16px] text-white overflow-hidden w-[50px] h-[50px]">
                  <img
                    src={
                      user.auth?.avatar != "null"
                        ? user.auth?.avatar
                        : "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                    }
                    className="rounded-full object-fill"
                    alt=""
                  />
                </Menu.Button>
                <Menu.Items className="absolute top-[100%] right-2 flex flex-col items-end bg-white text-black py-1 shadow-md">
                  <span className="text-[#999] ml-2">
                    {" "}
                    Xin chào {user.auth?.username || user.auth?.userName}
                  </span>
                  <Menu.Item>
                    {({ active }) => (
                      <p
                        className={`${
                          active
                            ? "bg-[#fea116] text-white p-1 cursor-pointer w-full text-right"
                            : "p-1 cursor-pointer w-full text-right"
                        }`}
                        onClick={() => navigate("/profile")}
                      >
                        Thông tin cá nhân
                      </p>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <p
                        className={`${
                          active
                            ? "bg-[#fea116] text-white p-1 cursor-pointer w-full text-right"
                            : "p-1 cursor-pointer w-full text-right"
                        }`}
                        onClick={logout}
                      >
                        Đăng xuất
                      </p>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
