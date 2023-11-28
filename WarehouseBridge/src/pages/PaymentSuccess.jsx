import { useEffect, useState } from "react";
import "../css/PaymentSuccess.css";
import whLogo from "../assets/images/fav.png";
import func from "../common/func";
import { useNavigate } from "react-router-dom";
function PaymentSuccess() {
  const [partnerCode, setPartnerCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("");
  const [orderType, setOrderType] = useState("");
  const [transId, setTransId] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [message, setMessage] = useState("");
  const [payType, setPayType] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [extraData, setExtraData] = useState("");
  const [signature, setSignature] = useState("");
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const urlSearchParams = new URLSearchParams(url);

    // if (!urlSearchParams.get('resultCode')
    //   || !urlSearchParams.get('partnerCode')
    //   || !urlSearchParams.get('orderId')
    //   || !urlSearchParams.get('requestId')
    //   || !urlSearchParams.get('amount')
    //   || !urlSearchParams.get('orderInfo')
    //   || !urlSearchParams.get('orderType')
    //   || !urlSearchParams.get('transId')
    //   || !urlSearchParams.get('orderType')
    //   || !urlSearchParams.get('payType')
    //   || !urlSearchParams.get('orderType')
    //   || !urlSearchParams.get('signature')
    // ) return window.location.href = '/'
    setPartnerCode(urlSearchParams.get("partnerCode"));
    setOrderId(urlSearchParams.get("orderId"));
    setRequestId(urlSearchParams.get("requestId"));
    setAmount(func.convertVND(Number.parseInt(urlSearchParams.get("amount"))));
    setOrderInfo(urlSearchParams.get("orderInfo"));
    setOrderType(urlSearchParams.get("orderType"));
    setTransId(urlSearchParams.get("transId"));
    setResultCode(urlSearchParams.get("resultCode"));
    setMessage(urlSearchParams.get("message"));
    setPayType(urlSearchParams.get("payType"));
    setResponseTime(urlSearchParams.get("responseTime"));
    setExtraData(urlSearchParams.get("extraData"));
    setSignature(urlSearchParams.get("signature"));
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        if (resultCode == 0) {
          navigate("/profile");
        } else navigate("/warehouse");
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown, navigate]);
  return (
    <div className="w-full min-h-screen">
      <div className="w-full md:w-[70%] h-[460px] mx-auto mt-5 flex items-start rounded-md overflow-hidden shadow-lg">
        <div className="w-full md:w-[40%] bg-[#af206f] px-2 h-full flex flex-col justify-around items-center">
          <p className="text-white text-center my-2">
            Nhà cung cấp <br /> &ensp; &ensp; &ensp; &ensp;{" "}
            <span className="font-bold">Momo Payment</span>
          </p>
          <div className="line"></div>
          <p className="text-white text-center my-2">
            Số tiền <br /> &ensp; &ensp; &ensp; &ensp;
            <span className="font-bold">{amount}</span>
          </p>
          <div className="line"></div>
          <p className="text-white text-center my-2">
            Thông tin <br /> &ensp; &ensp; &ensp; &ensp;{" "}
            <span className="font-bold">{orderInfo}</span>
          </p>
          <div className="line"></div>
          <p className="text-white text-center my-2">
            Đơn hàng <br /> &ensp; &ensp; &ensp; &ensp;
            <span className="font-bold">
              {orderType} <br />
              {orderId}
            </span>
          </p>
        </div>
        <div className="w-full md:w-[60%]">
          <div className="w-full justify-between items-center px-2 hidden lg:flex">
            <img src={whLogo} className="w-[200px] h-[70px]" alt="" />
            <img
              className="w-[70px] h-[70px]"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDK-HgXPh9osISQTLAHVdO3foi-FY3IOmbbAyr-TbKHwMI3lwllKDjBoS_N1ZipoMhusY&usqp=CAU"
              alt=""
            />
          </div>
          <hr className="mt-8 hidden lg:block" />
          <img
            className="mt-8 w-[150px h-[150px] mx-auto block"
            src={
              resultCode == 0
                ? "https://freepngimg.com/save/18343-success-png-image/1200x1200"
                : "https://icon-library.com/images/failed-icon/failed-icon-7.jpg"
            }
            alt=""
          />
          {resultCode == 0 ? (
            <p className="text-center w-[80%] lg:w-[50%] mx-auto my-3 ">
              Đơn hàng của bạn đã thanh toán thành công, vui lòng{" "}
              <span className="text-[#af206f] font-bold uppercase">không</span>{" "}
              tắt trình duyệt
            </p>
          ) : (
            <p className="text-center w-[80%] lg:w-[50%] mx-auto my-3 ">
              Đơn hàng của bạn đã thanh toán thất bại, vui lòng{" "}
              <span className="text-[#af206f] font-bold uppercase">không</span>{" "}
              tắt trình duyệt
            </p>
          )}
          <p className="text-center w-[80%] lg:w-[50%] mx-auto my-3 text-[#af206f] font-bold">
            Trở lại trang thanh toán mua hàng trong {countdown}s . . .
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
