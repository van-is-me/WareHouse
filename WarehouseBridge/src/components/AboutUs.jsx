import Counting from "./Counting";
import { FaWarehouse, FaUserCog } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import img1 from "../assets/images/kho1.jpg";
import img2 from "../assets/images/kho2.jpg";
import img3 from "../assets/images/kho3.png";
import img4 from "../assets/images/kho-bg.jpg";
import { useEffect, useState } from "react";
import API from "../API";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../reducers/SystemReducer";
function AboutUs() {
  const dispatch = useDispatch();
  const [itemWH, setItemWH] = useState(0);
  const [itemPartner, setItemPartner] = useState(0);
  const [itemLocation, setItemLocation] = useState(0);
  useEffect(() => {
    dispatch(changeLoadingState(true));
    API.warehouses()
      .then((res) => {
        dispatch(changeLoadingState(false));
        setItemWH(res.data.length);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });

    dispatch(changeLoadingState(true));
    API.provider()
      .then((res) => {
        dispatch(changeLoadingState(false));

        setItemPartner(res.data.length);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  }, []);
  return (
    <div className="w-full mb-20 flex flex-col md:flex-row px-10 pt-14">
      <div className="w-full lg:w-[48%]">
        <p className="text-[#0f1728] text-[20px] lg:text-[37px] font-bold">
          Chào mừng đến với <br />{" "}
          <span className="text-secondary">WAREHOUSE BRIDGE</span>
        </p>
        <p className="text-[#777] text-[12px] lg:text-[18px]">
          Warehouse Bridge là một trang web kết nối độc đáo giữa các chủ kho và
          khách hàng, tạo nên một sự giao thương thuận tiện và hiệu quả. Trang
          web này cung cấp một nền tảng trực tuyến nơi các chủ kho có thể quảng
          cáo và chia sẻ thông tin về các kho lưu trữ, trong khi khách hàng có
          thể tìm kiếm và đặt hàng hàng hóa một cách dễ dàng.
        </p>
        <div className="w-[50%] lg:w-full flex flex-wrap justify-around items-center my-5 mx-auto">
          <Counting
            name={"Số kho"}
            number={itemWH}
            icon={<FaWarehouse className="text-secondary text-[48px]" />}
          />
          <Counting
            name={"Đối tác"}
            number={itemPartner}
            icon={<FaUserCog className="text-secondary text-[48px]" />}
          />
          <Counting
            name={"Địa điểm"}
            number={itemWH}
            icon={<MdLocationOn className="text-secondary text-[48px]" />}
          />
        </div>
      </div>
      <div className="w-[48%] items-center justify-center flex-wrap flex-col hidden lg:flex">
        <div className="w-[70%] flex items-end">
          <img src={img1} className="h-[100px] mr-3" alt="" />
          <img src={img2} className="h-[160px] mb-5" alt="" />
        </div>
        <div className="w-[70%] flex items-start mt-3">
          <img src={img3} className="h-[70px] m-1" alt="" />
          <img src={img4} className="h-[130px] m-1" alt="" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
