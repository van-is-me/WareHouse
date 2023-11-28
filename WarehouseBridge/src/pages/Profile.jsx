import { useEffect, useRef, useState } from "react";
import "../css/Profile.css";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera, AiOutlineCloseCircle } from "react-icons/ai";
import { storage } from "../firebase";
import noti from "../common/noti";
import func from "../common/func";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { changeLoadingState } from "../reducers/SystemReducer";
import { authen } from "../reducers/UserReducer";
import FormBase from "../components/FormBase";
import API from "../API";
function Profile() {
  const user = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [indexTab, setIndexTab] = useState(0);
  const [listOrder, setListOrder] = useState([]);
  const [listWH, setListWH] = useState([]);
  const [contract, setContract] = useState({});
  const listTab = [
    { id: 0, name: "Tổng quan" },
    { id: 1, name: "Kho đã thuê" },
    { id: 2, name: "Lịch sử giao dịch" },
    { id: 3, name: "Dịch vụ thanh toán" },
  ];
  const role = user.role;
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avt, setAvt] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [pass, setPass] = useState("");
  const [passAgain, setPassAgain] = useState("");
  const [isShowChangeAvt, setIsShowAvt] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [tmpImg, setTmpImg] = useState("");
  const [curWH, setCurWH] = useState(null);
  const [isShowContract, setIsShowContract] = useState(false);
  const [isShowGood, setIsShowGood] = useState(false);
  const [goods, setGoods] = useState([]);
  const [listGoodOfRequest, setListGoodOfRequest] = useState([]);
  const [listGoodToDisplay, setListGoodToDisplay] = useState([]);

  const [isShowAddGoodToWH, setIsShowAddGoodToWH] = useState(false);
  const [listGoodTmp, setListGoodTmp] = useState([]);
  const [formData, setformData] = useState([
    { name: "Tên món đồ", binding: "name", type: "input" },
    { name: "Số lượng", binding: "quantity", type: "input" },
    { name: "Ảnh", binding: "avatar", type: "file" },
  ]);

  const [listServicePayment, setListServicePayment] = useState([]);

  useEffect(() => {
    dispatch(changeLoadingState(true));
    API.getOrder()
      .then((res) => {
        dispatch(changeLoadingState(false));
        if (Array.isArray(res.data)) {
          setListOrder(res.data.reverse());
        } else setListOrder(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
    // fetchWH()
    fetchContract();
    fetchUser();
    // fetchWarehouse()
    fetchServicePayment();
  }, []);

  function fetchUser() {
    API.getInfo()
      .then((res) => {
        setDataUser(res?.data);
        setName(res?.data.fullname);
        setAddress(res?.data.address);
        setAvt(res?.data.avatar);
        setBirthday(res?.data.birthday);
        setEmail(res?.data.email);
        setPhone(res?.data.phoneNumber);
        setUsername(res?.data.userName);
      })
      .catch((err) => {});
  }

  const fetchWarehouse = () => {
    dispatch(changeLoadingState(true));
    API.warehouses()
      .then((res) => {
        dispatch(changeLoadingState(false));
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  const fetchServicePayment = () => {
    dispatch(changeLoadingState(true));
    API.servicePayment()
      .then((res) => {
        dispatch(changeLoadingState(false));
        setListServicePayment(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  const fetchContract = () => {
    dispatch(changeLoadingState(true));
    API.contracts()
      .then((res) => {
        dispatch(changeLoadingState(false));
        const arr = res.data.reverse();
        setContract(arr[0]);
        API.getOderById(arr[0]?.orderId)
          .then((res) => {
            dispatch(changeLoadingState(true));
            API.warehouseDetailByID(res.data?.warehouseDetailId)
              .then((res) => {
                dispatch(changeLoadingState(false));
                API.warehouseById(res.data?.warehouseId).then((res) => {
                  setCurWH(res.data);
                });
              })
              .catch((err) => dispatch(changeLoadingState(false)));
          })
          .catch((er) => {});
      })
      .catch((err) => dispatch(changeLoadingState(false)));
  };

  // const fetchWH = () => {
  //   dispatch(changeLoadingState(true))
  //   API.rentWarehouseList()
  //     .then(res => {
  //       dispatch(changeLoadingState(false))
  //       setListWH(res.data)
  //     })
  //     .catch(err => {
  //       dispatch(changeLoadingState(false))
  //     })
  // }

  const getUserAgain = () => {
    API.getInfo()
      .then((res) => {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(authen(res.data));
        setDataUser(res?.data);
        setName(res?.data.fullname);
        setAddress(res?.data.address);
        setAvt(res?.data.avatar);
        setBirthday(res?.data.birthday);
        setEmail(res?.data.email);
        setPhone(res?.data.phoneNumber);
        setUsername(res?.data.userName);
      })
      .catch((err) => {});
  };
  const updateData = (type) => {
    switch (type) {
      case "fullName":
        if (user.auth?.fullname != name) updateUser();
        break;
      case "email":
        if (user.auth?.email != email) updateUser();
        break;
      case "username":
        if (user.auth?.userName != username) updateUser();
        break;
      case "phone":
        if (user.auth?.phoneNumber != phone) updateUser();
        break;
      case "address":
        if (user.auth?.address != address) updateUser();
        break;
      case "birthday":
        if (user.auth?.birthday != birthday) updateUser();
        break;
    }
  };

  const updateUser = () => {
    dispatch(changeLoadingState(true));
    API.updateInfo({
      userName: username,
      fullname: name,
      address: address,
      avatar: avt,
      birthday: birthday,
      email: email,
      phoneNumber: phone,
    })
      .then((res) => {
        noti.success(res.data);
        dispatch(changeLoadingState(false));
        getUserAgain();
      })
      .catch((err) => {
        noti.error(err?.response?.data);
        dispatch(changeLoadingState(false));
      });
  };

  const cancelAll = () => {
    setIsOpenPopup(false);
    setIsShowContract(false);
    setIsShowGood(false);
    setListGoodOfRequest([]);
    setListGoodToDisplay([]);
    setIsShowAddGoodToWH(false);
    setListGoodTmp([]);
  };

  const openPopup = () => {
    setIsOpenPopup(true);
    setTmpImg(
      avt != "null"
        ? avt
        : "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
    );
  };

  const changeImageProfile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const temporaryImageURL = event.target.result;
        setTmpImg(temporaryImageURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDetailOrder = (id) => {
    API.getOderById(id)
      .then((res) => {})
      .catch((err) => {});
  };

  const updateReduxState = () => {
    dispatch(authen(res.data));
  };

  const handleParentClick = () => {
    cancelAll();
  };
  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  const saveImage = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      dispatch(changeLoadingState(true));
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, "images/" + fileName);

      uploadBytes(storageRef, file)
        .then((snapshot) => {
          noti.success("Tải lên thành công");
          dispatch(changeLoadingState(false));
          cancelAll();
          getDownloadURL(storageRef).then((downloadURL) => {
            setAvt(downloadURL);
            dispatch(changeLoadingState(true));
            API.updateInfo({
              userName: username,
              fullname: name,
              address: address,
              avatar: downloadURL,
              birthday: birthday,
              email: email,
              phoneNumber: phone,
            })
              .then((res) => {
                getUserAgain();
                dispatch(changeLoadingState(false));
                noti.success("Chỉnh sửa ảnh đại diện thành công");
              })
              .catch((err) => {
                dispatch(changeLoadingState(false));
                noti.error("Chỉnh sửa ảnh đại diện thất bại");
              });
          });
        })
        .catch((error) => {
          console.error("Lỗi khi tải lên:", error);
        });
    } else noti.error("Bạn phải chọn lại ảnh mới để tải lên");
  };

  const changePass = () => {
    if (pass != passAgain)
      return noti.error("Mật khẩu không khớp, vui lòng nhập lại mật khẩu!");
    if (pass.length < 6) return noti.error("Mật khẩu phải có ít nhất 6 ký tự!");
    if (passAgain.length < 6)
      return noti.error("Mật khẩu phải có ít nhất 6 ký tự!");
    if (!/[A-Z]/.test(pass))
      return noti.error("Mật khẩu phải chứa ít nhất 1 chữ hoa!");
    if (!/[a-z]/.test(pass))
      return noti.error("Mật khẩu phải chứa ít nhất 1 chữ thường!");
    if (!/\d/.test(pass)) return noti.error("Mật khẩu phải chứa ít nhất 1 số!");
    if (!/[!@#$%^&*]/.test(pass))
      return noti.error("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!");
    dispatch(changeLoadingState(true));
    API.changePass(pass, passAgain)
      .then((res) => {
        // noti.success(res.data)
        noti.success("Đổi mật khẩu thành công");
        dispatch(changeLoadingState(false));
        setPass("");
        setPassAgain("");
      })
      .catch((err) => {
        noti.error(err?.response?.data);
        dispatch(changeLoadingState(false));
      });
  };

  const getStatus = (status) => {
    let tmpStatus = "";
    switch (status) {
      case "Success":
        tmpStatus = "Thành công";
        break;
      case "Waiting":
        tmpStatus = "Đang đợi";
        break;
      case "Fail":
        tmpStatus = "Thất bại";
        break;

      default:
        break;
    }
    return tmpStatus;
  };

  const actionShowContract = () => {
    setIsShowContract(true);
    dispatch(changeLoadingState(true));
    API.goods(contract?.rentWarehouseId)
      .then((res) => {
        dispatch(changeLoadingState(false));
        setGoods(res.data);
      })
      .catch((er) => dispatch(changeLoadingState(false)));
  };

  const actionShowGood = () => {
    setIsShowGood(true);
  };

  const handleAddGoodToRequest = (id, item) => {
    if (listGoodOfRequest.includes(id)) {
      setListGoodToDisplay(listGoodToDisplay.filter((item) => item?.id !== id));
      setListGoodOfRequest(listGoodOfRequest.filter((item) => item !== id));
    } else {
      item["tmpQuantity"] = 1;
      setListGoodToDisplay((oldArray) => [...oldArray, item]);
      setListGoodOfRequest((oldArray) => [...oldArray, id]);
    }
  };

  const createRequest = () => {
    if (listGoodOfRequest.length == 0)
      return noti.warning(
        "Bạn phải chọn ít nhất 1 món đồ để lấy ra khỏi kho!",
        2400
      );

    let finalList = [];

    dispatch(changeLoadingState(true));
    listGoodToDisplay.map((item) => {
      finalList.push({
        goodId: item?.id,
        quantity: Number.parseInt(item?.tmpQuantity),
      });
    });

    API.addRequest({
      // requestId: '',
      customerId: contract?.customerId,
      staffId: contract?.staffId,
      requestStatus: 1,
      denyReason: "",
      requestType: 1,
      completeDate: new Date().toISOString(),
      requestDetails: finalList,
    })
      .then((res) => {
        noti.success(res.data.result);
        cancelAll();
        dispatch(changeLoadingState(false));
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  const updateQuantity = (id, number) => {
    setListGoodToDisplay((oldArray) =>
      oldArray.map((item) => {
        if (item?.id === id) {
          const newTmpQuantity =
            number > 0 && number <= item?.quantity ? number : 1;
          return { ...item, tmpQuantity: newTmpQuantity };
        }
        return item;
      })
    );
  };

  const addGoodTolistTmp = (data) => {
    if (listGoodTmp.length > 6)
      return noti.warning(
        "Bạn chỉ có thể thêm tối da 6 món hàng vào kho trong 1 lần thêm",
        3000
      );
    if (!Number.isInteger(Number.parseInt(data?.quantity)))
      return noti.error("Bạn phải nhập số lượng là 1 số!");
    if (Number.parseInt(data?.quantity) > 100)
      return noti.error("Số lượng chỉ được dưới 100");
    if(data?.images.length == 0) return noti.error('Bạn phải thêm ảnh vào để tạo hàng hoá')
    setListGoodTmp([...listGoodTmp, data]);
  };
  return (
    <div className="w-full bg-[#f9f5f1] min-h-screen">
      <div className="w-full md:h-[250px] lg:h-[300px] bg-custom pt-5">
        <div className="w-full h-[70%] flex items-center justify-start">
          <div
            onClick={openPopup}
            className="h-[150px] w-[150px] overflow-hidden rounded-full ml-5 relative"
          >
            <img
              onMouseOver={() => setIsShowAvt(true)}
              onMouseLeave={() => setIsShowAvt(false)}
              src={
                avt != "null"
                  ? avt
                  : "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
              }
              className="w-full object-fill cursor-pointer"
              alt=""
            />
            {isShowChangeAvt ? (
              <div
                onMouseOver={() => setIsShowAvt(true)}
                onMouseLeave={() => setIsShowAvt(false)}
                className="absolute w-full bg-black/60 h-[50px] bottom-0 flex justify-center items-center cursor-pointer"
              >
                <AiOutlineCamera className="text-white text-[24px]" />
              </div>
            ) : null}
          </div>
          <div className=" ml-10 text-[24px] text-white">
            <p>{username}</p>
            <p>{role}</p>
          </div>
        </div>
        <div className="h-[30%] flex items-center justify-start flex-wrap px-5 mt-2">
          {listTab.map((i) => (
            <div
              onClick={() => setIndexTab(i.id)}
              key={i.id}
              className={`text-white font-bold px-3 py-2 cursor-pointer  mr-1 lg:mr-3 ${
                i.id == indexTab ? "active" : "hover:bg-[#ffffff1a]"
              }`}
            >
              {i.name}
            </div>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="w-full">
        {/* tab 1 */}
        <div
          className={`w-[90%] mx-auto my-5 ${
            indexTab == 0 ? "block" : "hidden"
          }`}
        >
          <div className={`w-full shadow-xl rounded-lg mt-5 bg-white p-8`}>
            <span className="font-bold text-[30px]">Thông tin cơ bản</span>
            <div className="w-full flex items-start">
              <div className="w-[40%] flex-col flex items-start font-bold text-[14px] h-[200px] justify-between">
                <span className="px-2 py-1">Họ và Tên:</span>
                <span className="px-2 py-1">Tên tài khoản:</span>
                <span className="px-2 py-1">Email:</span>
                <span className="px-2 py-1">Sinh nhật:</span>
                <span className="px-2 py-1">Số điện thoại:</span>
                <span className="px-2 py-1">Địa chỉ:</span>
              </div>
              <div className="w-[60%] flex flex-col items-start h-[200px] justify-between">
                <input
                  type="text"
                  className="w-full focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => updateData("fullName")}
                  value={name}
                />
                <input
                  type="text"
                  className="w-full cursor-not-allowed focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => updateData("username")}
                  value={username}
                  disabled
                />
                <input
                  type="text"
                  className="w-full focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1 cursor-not-allowed"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => updateData("email")}
                  value={email}
                  disabled
                />
                <input
                  type="datetime-local"
                  className="w-full focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setBirthday(e.target.value)}
                  onBlur={() => updateData("birthday")}
                  value={birthday}
                />
                <input
                  type="text"
                  className="w-full focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => updateData("phone")}
                  value={phone}
                />
                <input
                  type="text"
                  className="w-full focus:outline-none focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => updateData("address")}
                  value={address}
                />
              </div>
            </div>
          </div>

          <div className={`w-full shadow-xl rounded-lg mt-5 bg-white p-8`}>
            <span className="font-bold text-[30px]">Bảo mật</span>
            <div className="w-full flex items-start">
              <div className="w-[40%] flex-col flex items-start font-bold text-[14px]">
                <span className="px-2 py-1">Nhập mật khẩu mới:</span>
                <span className="px-2 py-1 mt-5">Nhập lại mật khẩu mới:</span>
              </div>
              <div className="w-[60%] flex flex-col items-end">
                <input
                  type="text"
                  className="w-full focus:outline-none bg-gray-100 focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setPass(e.target.value)}
                  value={pass}
                />
                <input
                  type="text"
                  className="w-full mt-5 focus:outline-none bg-gray-100 focus:bg-[#ccc] px-2 rounded-md py-1"
                  onChange={(e) => setPassAgain(e.target.value)}
                  value={passAgain}
                />
                <button
                  className="btn-primary mt-5 rounded-md px-3 py-1"
                  onClick={changePass}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* tab 2 */}
        <div
          className={`w-[90%] mx-auto shadow-xl rounded-lg mt-5 bg-white p-4 ${
            indexTab == 1 ? "block" : "hidden"
          }`}
        >
          <div className="w-[90%] mx-auto grid grid-cols-12 gap-3">
            {curWH ? (
              <div className="col-span-4 shadow-lg">
                <div className="w-full h-[200px] overflow-hidden flex items-center justify-center">
                  <img src={curWH?.imageURL} alt="" />
                </div>
                <div className="w-full pl-2">
                  <p className="text-[18px] font-bold">{curWH?.name}</p>
                  <p className="text-[14px] text-gray-600">{curWH?.address}</p>
                  <div className="w-full flex items-center justify-around my-2">
                    <button
                      className="px-3 py-1 rounded-md btn-secondary invisible"
                      onClick={() => actionShowGood()}
                    >
                      Xem hàng hoá
                    </button>
                    <button
                      className="px-3 py-1 rounded-md btn-primary"
                      onClick={() => actionShowContract()}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* tab 3 */}
        <div
          className={`w-[90%] mx-auto shadow-xl rounded-lg mt-5 bg-white p-4 ${
            indexTab == 2 ? "block" : "hidden"
          }`}
        >
          <div className="w-[90%] mx-auto grid grid-cols-12 gap-3">
            {listOrder.length == 0 ? (
              <p className="text-center col-span-12 font-bold text-[#666]">
                Không có dữ liệu
              </p>
            ) : (
              listOrder.map((item) => (
                <div
                  key={item.id}
                  className="my-2 p-3 col-span-12 md:col-span-6 lg:col-span-4 flex items-center justify-between shadow-lg flex-wrap flex-col lg:flex-row"
                >
                  <div className="flex items-start justify-around w-full mb-2">
                    <FaMoneyBillTransfer
                      className={`text-[24px] ${
                        item?.orderStatus == 1
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                    <span className="font-bold">
                      - {func.convertVND(item?.totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Tình trạng thanh toán</span>
                    <span
                      className={`font-bold ${
                        item?.paymentStatus == "Waiting"
                          ? "text-orange-500"
                          : item?.paymentStatus == "Fail"
                          ? "text-gray-500"
                          : "text-green-500"
                      }`}
                    >
                      {/* {item?.paymentStatus == 'Waiting' ? 'Đang đợi' : 'Thành công'} */}
                      {getStatus(item?.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Tài khoản/thẻ</span>
                    <span className="font-bold">Ví MoMo</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Tổng phí</span>
                    <span className="font-bold">Miễn phí</span>
                  </div>
                  <div className="line block"></div>
                  <div className="flex items-center justify-between w-full">
                    <span>Loại kho</span>
                    <span className="font-bold">{`${item?.width} x ${item?.depth} x ${item?.height} ${item?.unitType}`}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Mệnh giá</span>
                    <span className="font-bold">
                      {func.convertVND(item?.warehousePrice)}{" "}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Phí dịch vụ</span>
                    <span className="font-bold">
                      {func.convertVND(item?.servicePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Ngày tạo</span>
                    <span className="font-bold">
                      {func.convertDate(item?.creationDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Ngày lấy hàng</span>
                    <span className="font-bold">
                      {item?.deletionDate != null
                        ? func.convertDate(item?.deletionDate)
                        : "Chưa lấy"}
                    </span>
                  </div>
                  <div className="line"></div>
                  <div className="flex items-center justify-between w-full">
                    <span>Tổng cuộc gọi</span>
                    <span className="font-bold">{item?.totalCall}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span>Kết nối trong ngày</span>
                    <span className="font-bold">
                      {item?.contactInDay == false ? "Không" : "Có"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* tab 4 */}
        <div
          className={`w-[90%] mx-auto shadow-xl rounded-lg mt-5 bg-white p-4 ${
            indexTab == 3 ? "block" : "hidden"
          }`}
        >
          <div className="w-[90%] mx-auto grid grid-cols-12 gap-3">
            {listServicePayment.length == 0 ? (
              <p className="col-span-12 text-gray-500 text-center w-full text-[18px]">
                Không có dữ liệu
              </p>
            ) : null}
            {listServicePayment.length > 0 &&
              listServicePayment.map((item) => (
                <div
                  className="col-span-12 md:col-span-4 border-gray-300 border-solid border-[1px] rounded-lg flex items-start justify-between px-2 py-1"
                  key={item?.id}
                >
                  <div className="w-[30%] flex flex-col items-start">
                    <span>Tháng</span>
                    <span>Năm</span>
                    <span>Phí dịch vụ</span>
                    <span>Phí kho</span>
                    <span>Tổng phí</span>
                    <span>Hạn chót</span>
                  </div>
                  <div className="w-[65%] flex items-end flex-col">
                    <span>{item?.monthPayment}</span>
                    <span>{item?.yearPayment}</span>
                    <span>{func.convertVND(item?.servicePrice)}</span>
                    <span>{func.convertVND(item?.warehousePrice)}</span>
                    <span>{func.convertVND(item?.totalPrice)}</span>
                    <span>{func.convertDate(item?.deadline)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {isOpenPopup ? (
        <div className="fog" onClick={handleParentClick}>
          <div
            className="w-full md:w-[60%] bg-white rounded-lg p-2"
            onClick={handleChildClick}
          >
            <div className="w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden mx-auto">
              <img className="w-full" src={tmpImg} alt="" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <div className="w-full flex lg:w-[50%] items-center mx-auto justify-between mt-4">
              <button
                onClick={cancelAll}
                className="w-[49%] btn-cancel px-3 py-1 rounded-md mr-2"
              >
                Huỷ
              </button>
              <button
                onClick={saveImage}
                className="w-[49%] btn-primary px-3 py-1 rounded-md"
              >
                Lưu ảnh
              </button>
            </div>
            <button
              onClick={changeImageProfile}
              className="btn-secondary block mx-auto mt-4 px-3 py-1 rounded-md w-full lg:w-[50%]"
            >
              Tải hình ảnh lên
            </button>
          </div>
        </div>
      ) : null}

      {isShowContract ? (
        <div className="bg-fog-cus hide-scroll" onClick={handleParentClick}>
          <div
            onClick={handleChildClick}
            className="hide-scroll pt-6 px-4 pb-[100px] lg:pb-6 max-h-screen lg:max-h-[55vh] overflow-y-scroll rounded-md bg-white shadow-lg w-full lg:w-[70%] flex flex-wrap items-start justify-between relative"
          >
            <div className="w-full relative">
              <span className="text-[24px] font-bold">Hợp đồng</span>
              <AiOutlineCloseCircle
                onClick={cancelAll}
                className="absolute right-2 top-2 text-[18px] cursor-pointer"
              />
            </div>
            <div className="w-full flex items-start flex-col md:flex-row">
              <div className="w-full md:w-[30%]">
                <p>Khách hàng: {contract?.customer?.userName}</p>
                <p>Giá kho: {func.convertVND(contract?.warehousePrice)}</p>
                <p>Giá dịch vụ: {func.convertVND(contract?.servicePrice)}</p>
                <p>Phí đã cọc: {func.convertVND(contract?.depositFee)}</p>
              </div>
              <div className="w-full md:w-[50%]">
                <p>Email: {contract?.customer?.email}</p>
                <p>Mô tả: {contract?.description}</p>
                <p>Ngày bắt đầu: {func.convertDate(contract?.startTime)}</p>
                <p>Ngày kết thúc: {func.convertDate(contract?.endTime)}</p>
              </div>
            </div>
            <div className="w-full mt-5 flex items-center justify-between">
              <span className="text-[24px] font-bold">Hàng hoá</span>
              <button
                onClick={() => setIsShowAddGoodToWH(true)}
                className="btn-primary px-3 py-1 rounded-lg"
              >
                Thêm đồ vào kho
              </button>
            </div>
            <div className="w-full mx-auto grid grid-cols-12 gap-3">
              {goods.map((item) => (
                <div key={item?.id} className="col-span-12 md:col-span-4">
                  <div className="w-full h-[250px] relative overflow-hidden border-gray-200 border-solid border-[1px] flex items-center justify-center">
                    <img
                      src={item?.goodImages[0]?.imageUrl}
                      alt="ảnh hàng hoá"
                    />
                    <input
                      type="checkbox"
                      className="absolute top-3 right-3 w-[20px] h-[20px]"
                      onChange={() => handleAddGoodToRequest(item?.id, item)}
                    />
                  </div>
                  <p className="w-full text-center">{item?.goodName}</p>
                  <p className="w-full text-center">
                    Số lượng: {item?.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {listGoodOfRequest.length > 0 ? (
        <div className="w-screen lg:w-[90%] lg:mx-auto fixed bottom-0 left-0 right-0 shadow-2xl z-[99] overscroll-x-auto h-[100px] md:h-[150px] bg-white lg:rounded-tr-2xl lg:rounded-tl-2xl border-[1px] border-solid border-gray-300 lg:border-black">
          <div className="md:w-[80%] w-full mx-auto flex items-center overflow-x-scroll hide-scroll">
            {listGoodToDisplay.map((item) => (
              <div key={item?.id} className="flex items-center flex-col mx-1">
                <div className="w-[70px] h-[70px] overflow-hidden flex items-center justify-center ">
                  <img
                    src={item?.goodImages[0]?.imageUrl}
                    alt="good image"
                    className="object-fill"
                  />
                </div>
                <p>{item?.goodName}</p>
                <input
                  className="outline-none w-[50px] bg-gray-400"
                  type="number"
                  value={item?.tmpQuantity}
                  onChange={(e) => updateQuantity(item?.id, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button
            onClick={createRequest}
            className="rounded-lg btn-primary px-3 py-1 absolute right-10 bottom-4"
          >
            Tạo yêu cầu lấy đồ trong kho
          </button>
        </div>
      ) : null}

      {isShowAddGoodToWH ? (
        <div className="bg-fog-cus">
          <div className="w-[50%] overflow-y-scroll hide-scroll max-h-[80vh] bg-white rounded-lg p-5">
            <div className="w-full mx-auto flex">
              <FormBase
                onCancel={cancelAll}
                isDisplayBG={false}
                title={formData}
                onSubmit={addGoodTolistTmp}
                buttonName="Thêm mới"
                totalImage={1}
              />
            </div>

            {listGoodTmp.length > 0 ? (
              <div className="w-full flex items-center justify-between px-5">
                <p className="text-[18px]">Hàng bạn muốn thêm: </p>
                <button className="btn-primary px-3 py-1 rounded-lg">
                  Tạo yêu cầu thêm hàng hoá
                </button>
              </div>
            ) : null}

            <div className="w-[90%] mx-auto grid grid-cols-12 gap-3">
              {listGoodTmp.length > 0 &&
                listGoodTmp.map((item, index) => (
                  <div
                    className="col-span-6 md:col-span-4 flex flex-col items-center max-h-[400px] overflow-y-scroll hide-scroll"
                    key={index}
                  >
                    <div className="w-[100px] h-[100px] overflow-hidden flex items-center justify-center">
                      {item?.images?.length > 0 && item.images[0] ? (
                        <img
                          className="object-fill"
                          src={URL.createObjectURL(item?.images[0])}
                          alt="good image"
                        />
                      ) : (
                        <span>No image available</span>
                      )}
                    </div>
                    <p>Tên: {item?.name}</p>
                    <p>Số lượng: {item?.quantity}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
