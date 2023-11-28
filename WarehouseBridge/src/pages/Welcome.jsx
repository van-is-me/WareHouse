import { useNavigate } from "react-router-dom";
import "../css/Welcome.css";
import mainImg from "../assets/images/kho.png";
function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="w-full relative hide-scroll">
      <div className="w-full flex items-center justify-between px-5 my-5">
        <span className="font-bold ml-20 xl:block hidden">WAREHOUSE BRIDGE</span>
        <ul className="flex items-center md:text-[16px] text-[10px] mr-36">
          <li onClick={() => navigate("/")} className="md:mx-5 cursor-pointer w-[80px] md:w-[120px]">
            Trang chủ
          </li>
          <li
            onClick={() => navigate("/about")}
            className="md:mx-5 cursor-pointer w-[80px] md:w-[120px]"
          >
            Về chúng tôi
          </li>
          <li
            onClick={() => navigate("/warehouse")}
            className="md:mx-5 cursor-pointer w-[80px] md:w-[120px]"
          >
            Danh sách kho
          </li>
          <li
            onClick={() => navigate("/contact")}
            className="md:mx-5 cursor-pointer w-[80px] md:w-[120px]"
          >
            Liên hệ
          </li>
        </ul>
        <div className="line1 xl:block hidden"></div>
        <div className="line2 xl:block hidden"></div>
        <div className="fixed top-[10%] md:top-[20%] left-[4%] w-[300px] h-[200px] lg:w-[400px] lg-[h-300px] xl:w-[500px] xl:h-[350px] overflow-hidden flex items-center justify-center">
          <img src={mainImg} alt="" className="object-fill" />
        </div>
        <div className="fixed right-0 md:right-[50px] xl:right-[100px] top-[45%] md:top-[50%] xl:top-[20%] w-full md:w-[400px] lg:w-[600px] xl:w-[700px]">
          <span className="text-[30px] md:text-[40px] xl:text-[80px] font-bold">Warehouse Bridge</span>
          <p className="text-[14px] md:text-[16px] xl:text-[24px] text-gray-500 w-full">
            Khám phá các giải pháp lưu trữ hiệu quả với dịch vụ cho thuê kho tại
            Warehouse Bridge. Đảm bảo an toàn và tiện lợi cho hàng hóa của bạn
            với các kho tự quản chất lượng cao. Tận dụng không gian lưu trữ linh
            hoạt và tiện ích đầy đủ. Đặt ngay để trải nghiệm sự thuận lợi và
            chuyên nghiệp trong quản lý kho của chúng tôi!
          </p>
          <div className="w-full xl:w-[50%] flex items-center justify-around mt-3">
            <button
              className="px-2 md:px-5 py-1 md:py-2 text-[12px] md:text-[18px] rounded-lg btn-secondary"
              onClick={() => navigate("/")}
            >
              Tìm hiểu thêm
            </button>
            <button
              className="px-2 md:px-5 py-1 md:py-2 text-[12px] md:text-[18px] rounded-lg btn-primary"
              onClick={() => navigate("/warehouse")}
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
