import { useEffect, useState } from "react";
import {
  AiFillEye,
  AiFillStar,
  AiFillCaretRight,
  AiFillCaretLeft,
} from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import WarehouseItem from "../components/WarehouseItem";
import noti from "../common/noti";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../API";
import { useDispatch, useSelector } from "react-redux";
import { changeLoadingState } from "../reducers/SystemReducer";
import "../css/WarehouseDetail.css";
import GoogleMapReact from "google-map-react";
import func from "../common/func";
import Rating from "../components/Rating";
import PinLocation from "../components/PinLocation";
const AnyReactComponent = ({ text }) => <div>{text}</div>;
function WarehouseDetail() {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listWarehouseByCategory, setListWarehouseByCategory] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [curDetailSelected, setCurDetailSelected] = useState(null);
  const [indexTab, setIndexTab] = useState(1);
  const [listDetail, setListDetail] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [isOrder, setIsOrder] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [center, setCenter] = useState({});
  const [listFeedBack, setListFeedBack] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const {
    WHname,
    latitude,
    longitude,
    listImage,
    description,
    shortDescription,
    categoryId,
    orderNow,
  } = state || {};

  // if (!func.isValidCoordinates(latitude, longitude) && isValidCoordinate) {
  //     setIsValidCoordinate(false)
  // }

  const defaultProps = {
    center: {
      lat: 10.882359,
      lng: 106.782523,
    },
    zoom: 15,
  };

  useEffect(() => {
    fetchListWarehouseDetailById();
    fetchListWarehouseByCategoryId();
    const props = {
      center: {
        lat: latitude,
        lng: longitude,
      },
      zoom: 15,
    };
    setCenter(props);
    fetchListCategory();
    fetchListFeedback();
    // if(orderNow == true) isShowOrder()
  }, [id]);

  function cancelAll() {
    setIsOrder(false);
  }

  const fetchListFeedback = () => {
    dispatch(changeLoadingState(true));
    API.feedbackByID(id)
      .then((res) => {
        dispatch(changeLoadingState(false));
        setListFeedBack(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  const postFeedback = () => {
    dispatch(changeLoadingState(true));
    API.postFeedback(id, {
      rating: rating + "",
      feedbackText: feedback,
    })
      .then((res) => {
        dispatch(changeLoadingState(false));
        noti.success("Thêm đánh giá thành công");
        fetchListFeedback();
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.warning(
          "Vui lòng đặt kho và hoàn thành quá trình thanh toán và ký hợp đồng trước khi gửi đánh giá!",
          2000
        );
      });

    setRating(5);
    setFeedback("");
  };

  function fetchListWarehouseDetailById() {
    dispatch(changeLoadingState(true));
    API.warehouseDetailById(id)
      .then((res) => {
        dispatch(changeLoadingState(false));
        setListDetail(res.data);
        setCurDetailSelected(res.data[0]?.id);
        if (orderNow == true) isShowOrder();
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error(err?.response.data);
      });
  }

  function fetchListCategory() {
    dispatch(changeLoadingState(true));
    API.categories()
      .then((res) => {
        dispatch(changeLoadingState(false));
        setListCategory(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error(err?.response.data);
      });
  }

  function fetchListWarehouseByCategoryId() {
    dispatch(changeLoadingState(true));
    API.warehouseByCategory(categoryId)
      .then((res) => {
        dispatch(changeLoadingState(false));
        setListWarehouseByCategory(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error(err?.response.data);
      });
  }

  const listTab = [
    { id: 1, name: "Tổng quan", icon: <AiFillEye /> },
    { id: 2, name: "Giá cả", icon: <FaMoneyBillAlt /> },
    { id: 3, name: "Vị trí", icon: <MdLocationOn /> },
    { id: 4, name: "Đánh giá", icon: <AiFillStar /> },
  ];
  const changeTab = (index) => {
    setIndexTab(index);
  };

  const changeWarehouseType = (index, id) => {
    setCurIndex(index);
    setCurDetailSelected(id);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listImage.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listImage.length - 1 : prevIndex - 1
    );
  };

  const isShowOrder = () => {
    setIsOrder(true);
    // setCurDetailSelected(listDetail[0]?.id)
  };

  const handleParentClick = () => {
    cancelAll();
  };
  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  const getOrderNow = (id) => {
    if (user.auth)
      navigate("/payment", {
        state: {
          detailId: id,
        },
      });
    else {
      navigate("/login");
      noti.warning("Bạn phải đăng nhập để có thể đặt kho!!!", 3000);
    }
    // navigate('/payment', {
    //     state: {
    //         detailId: id
    //     }
    // })
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="w-full bg-white">
      <div className="w-[90%] mx-auto mt-10 flex justify-between flex-col md:flex-row">
        <div className="w-full md:w-[65%]">
          <div className="w-full relative overflow-hidden h-[175px] sm:h-[300px] md:h-[400px]">
            {/* <img className="w-full top-0 left-0 absolute" src={firstImage} alt="" /> */}
            <div className="w-full h-[400px] top-0 left-0 absolute flex justify-around items-center">
              <button
                className="absolute top-[50%] btn-primary translate-x-[-50%] left-[21px] px-3 py-1"
                onClick={prevImage}
              >
                <AiFillCaretLeft />
              </button>
              <img
                className="w-full object-fill"
                src={listImage[currentImageIndex]?.imageURL}
                alt="Slider"
              />
              <button
                className="absolute top-[50%] translate-x-[-50%] btn-primary right-[-21px] px-3 py-1"
                onClick={nextImage}
              >
                <AiFillCaretRight />
              </button>
            </div>
          </div>
          <p className="text-primary font-bold text-[18px] md:text-[30px] mt-4">
            {WHname}
          </p>
          <p className="text-[#666]">{shortDescription}</p>

          {listDetail.length > 0 ? (
            <div className="w-full mt-10 mb-4 px-4 py-2 flex items-center justify-between flex-wrap">
              {listTab.map((tab) => (
                <p
                  onClick={() => changeTab(tab.id)}
                  className={`flex items-center text-[24px] text-secondary cursor-pointer hover:bg-[#dbdbdb] p-1 ${
                    indexTab == tab.id ? "bg-[#dbdbdb]" : ""
                  }`}
                  key={tab.id}
                >
                  {tab.icon}&nbsp;
                  <span className="text-primary text-[18px] md:text-[30px]">
                    {tab.name}
                  </span>
                </p>
              ))}
            </div>
          ) : null}
          {listDetail.length > 0 ? (
            <div className="w-full mt-4 mb-10">
              {/* tab 1 */}
              <div className={`w-full ${indexTab == 1 ? "block" : "hidden"}`}>
                <p className="text-[#666]">{description}</p>
              </div>

              {/* tab2 */}
              <div
                className={`w-full flex items-start justify-center ${
                  indexTab == 2 ? "block" : "hidden"
                }`}
              >
                <div className="w-[50%] flex ">
                  {listDetail.length > 0 ? (
                    <p className="text-primary font-bold text-[20px]">
                      Các loại kích thước kho:
                    </p>
                  ) : null}
                  <div className="w-full flex items-center justify-start flex-wrap my-2">
                    {listDetail.map((item, index) => (
                      <div
                        onClick={() => changeWarehouseType(index, item.id)}
                        key={item.id}
                        className={`bg-white border-[#0f1728] border-solid border-[1px] rounded-md flex items-center cursor-pointer w-[140px] justify-center mr-4 text-[14px] my-2 ${
                          index == curIndex ? "isActive" : null
                        }`}
                      >
                        {item?.width} x {item?.depth} x {item?.height}{" "}
                        {item?.unitType}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[16px]">
                    <span className="font-bold text-primary">Giá kho:</span>{" "}
                    {func.convertVND(listDetail[curIndex]?.warehousePrice)}
                  </p>
                  <br />
                  <p className="text-[16px]">
                    <span className="font-bold text-primary">Giá dịch vụ:</span>{" "}
                    {func.convertVND(listDetail[curIndex]?.servicePrice)}
                  </p>
                  <br />
                </div>
              </div>

              <div className={`w-full ${indexTab == 3 ? "block" : "hidden"}`}>
                <div className="w-full h-[500px]">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      // key: 'AIzaSyCAPfe1hBNDgKaDLdgayN3KAGsHjebY7Cg',
                      key: "AIzaSyDQg29CzefG-QLdH9Agrxl3VokTjiQyfCA",
                      // language: 'en',
                    }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                  >
                    <PinLocation lat={latitude} lng={longitude} text={WHname} />
                  </GoogleMapReact>
                </div>
              </div>

              {/* tab4 */}
              <div className={`w-full ${indexTab == 4 ? "block" : "hidden"}`}>
                {listFeedBack.length == 0 ? (
                  <p className="font-bold text-[18px] text-primary">
                    Không có dữ liệu
                  </p>
                ) : null}
                {listFeedBack.map((item) => (
                  <div
                    className="w-full flex items-start flex-col mt-5"
                    key={item?.id}
                  >
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center w-full">
                        <div className="w-[60px] h-[60px] overflow-hidden flex items-center justify-center rounded-full">
                          <img
                            src={item?.applicationUser?.avatar}
                            alt="user image"
                            className="object-fill"
                          />
                        </div>
                        <div className="flex flex-col ml-5">
                          <span>{item?.applicationUser?.userName}</span>
                          <span>{func.convertDate(item?.creationDate)}</span>
                        </div>
                      </div>
                      <Rating
                        readOnly={true}
                        numberRating={Number.parseInt(item?.rating)}
                      />
                    </div>
                    <div className="w-full">
                      <p className="w-full">{item?.feedbackText}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 w-full flex flex-col items-end border-[1px] mt-10 border-solid border-gray-200 rounded-md">
                  <div className="w-full flex items-center my-3">
                    <Rating
                      numberRating={rating}
                      onRatingChange={handleRatingChange}
                      readOnly={false}
                    />
                  </div>
                  <textarea
                    placeholder="Bình luận về kho"
                    value={feedback}
                    className="bg-gray-100 outline-none w-full rounded-md min-h-[100px] p-4"
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                  <button
                    onClick={postFeedback}
                    className="btn-primary px-3 py-1 rounded-md my-4"
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-full md:w-[30%]">
          <div
            onClick={isShowOrder}
            className="w-[80%] text-center py-3 mx-auto bg-secondary text-white text-[24px] btn-secondary"
          >
            Đặt ngay
          </div>
          <p className="mt-10 text-[30px] text-primary font-bold">Danh mục</p>
          <div className="flex w-full flex-wrap mt-3">
            {listCategory.map((item) => (
              <div key={item?.id} className="w-full relative mt-2">
                <img
                  className="w-full max-h-[200px] object-fill"
                  src={item?.imagerUrl}
                  alt=""
                />
                <div className="absolute bottom-0 left-0 p-2 bg-secondary text-[20px] text-white font-bold">
                  {item?.name}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[30px] text-primary font-bold">
            Hỗ trợ, liên hệ
          </p>
          <div
            onClick={() => window.open("tel:0975688774")}
            className="w-[80%] text-center py-3 mx-auto bg-secondary btn-secondary text-white text-[24px] mt-5"
          >
            +0975688774
          </div>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen pt-10">
        <h1 className="text-[26px] lg:text-[47px] uppercase font-bold text-primary text-center">
          Khám phá thêm <span className="text-secondary">kho</span>
        </h1>

        <div className="w-[80%] mx-auto grid grid-cols-12 gap-3">
          {listWarehouseByCategory.map((item) => (
            <div
              key={item?.id}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <WarehouseItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {isOrder ? (
        <div className="fog" onClick={handleParentClick}>
          <div
            onClick={handleChildClick}
            className="w-[95%] md:w-[60%] bg-white rounded-lg flex flex-col items-center p-4"
          >
            <div className="w-full flex flex-col items-center">
              {listDetail.length > 0 ? (
                <p className="text-primary font-bold text-[20px]">
                  Các loại kích thước kho:
                </p>
              ) : null}
              <div className="w-full flex items-center justify-center flex-wrap my-2">
                {listDetail.map((item, index) => (
                  <div
                    onClick={() => changeWarehouseType(index, item.id)}
                    key={item.id}
                    className={`bg-white border-[#0f1728] border-solid border-[1px] rounded-md flex items-center cursor-pointer w-[140px] justify-center mr-4 text-[14px] my-2 ${
                      index == curIndex ? "isActive" : null
                    }`}
                  >
                    {item?.width} x {item?.depth} x {item?.height}{" "}
                    {item?.unitType}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
              <p className="text-[16px]">
                <span className="font-bold text-primary">Giá kho:</span>{" "}
                {func.convertVND(listDetail[curIndex]?.warehousePrice)}
              </p>
              <br />
              <p className="text-[16px]">
                <span className="font-bold text-primary">Giá dịch vụ:</span>{" "}
                {func.convertVND(listDetail[curIndex]?.servicePrice)}
              </p>
              <br />
            </div>
            <div className="w-full flex justify-around items-center">
              <button className="btn-cancel p-3 rounded-lg" onClick={cancelAll}>
                Huỷ
              </button>
              <button
                className="btn-primary p-3 rounded-lg"
                onClick={() => getOrderNow(curDetailSelected)}
              >
                Đặt ngay
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default WarehouseDetail;
