import API from "../API";
import { useEffect, useState } from "react";
function OutstandingPartner() {
  const [list, setList] = useState([]);

  useEffect(() => {
    API.provider()
      .then((res) => {
        setList(res.data.slice(0, 4));
      })
      .catch((err) => {});
  }, []);
  return (
    <div className="w-full my-10">
      <div className="w-[60%] mx-auto flex items-center flex-col">
        <h1 className="text-secondary font-bold text-[16px] md:text-[20px] lg:text-[26px] title-cus relative text-center uppercase">
          Warehouse Bridge
        </h1>
        <h1 className="text-[26px] lg:text-[47px] uppercase font-bold text-primary">
          đối tác <span className="text-secondary">nổi bật</span>
        </h1>
      </div>
      <div className="w-[80%] mx-auto grid grid-cols-12 gap-3 mt-3">
        {list.map((i) => (
          <div
            key={i?.id}
            className="col-span-12 md:col-span-6 lg:col-span-3 shadow-lg pb-4 my-3"
          >
            <div className="w-full h-[200px] overflow-hidden flex items-center justify-center">
              <img src={i?.image} className="w-full object-fill" alt="" />
            </div>
            <div className="w-[60%] mx-auto flex items-center justify-around my-3">
              {/* <BiLogoFacebook className='icon-s7' />
                            <BiLogoTwitter className='icon-s7' />
                            <BiLogoInstagramAlt className='icon-s7' /> */}
            </div>
            <p className="text-[24px] text-primary text-center">{i?.name}</p>
            <p className="text-center text-[#666]">Đối tác</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutstandingPartner;
