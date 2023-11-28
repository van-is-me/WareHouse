import AboutUs from "../components/AboutUs";
import {
  BiLogoFacebook,
  BiLogoInstagramAlt,
  BiLogoTwitter,
} from "react-icons/bi";
import "../css/About.css";
import { useEffect, useState } from "react";
function About() {
  const [listMember, setListMember] = useState([
    {
      fullName: "Hoàng Quốc Dũng",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Nguyễn Văn Duy",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Phạm Đức Nghĩa",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Nguyễn Thị Trà My",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Phùng Thị Thuỳ Trang",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Nguyễn Minh Đăng",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Nguyễn Đức Hải Văn",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
    {
      fullName: "Hoàng",
      role: "Đồng sáng lập",
      img: "https://png.pngtree.com/png-clipart/20190924/original/pngtree-user-vector-avatar-png-image_4830521.jpg",
    },
  ]);

  useEffect(() => {
    for (let i = listMember.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = listMember[i];
      listMember[i] = listMember[j];
      listMember[j] = temp;

      setListMember(listMember)
    }
  }, []);
  return (
    <div className="w-full">
      <AboutUs />
      <div className="w-full mb-10">
        <div className="w-[60%] mx-auto flex items-center flex-col">
          <h1 className="text-secondary font-bold text-[16px] md:text-[20px] lg:text-[26px] title-cus relative text-center uppercase">
            Thành Viên
          </h1>
          <h1 className="text-[26px] lg:text-[47px] uppercase font-bold text-primary">
            tìm hiểu về <span className="text-secondary">các thành viên</span>
          </h1>
        </div>
        <div className="w-[80%] mx-auto grid grid-cols-12 gap-3 mt-10">
          {listMember.map((item) => (
            <div
              key={item.fullName}
              className="col-span-12 md:col-span-6 lg:col-span-4 shadow-lg pb-4 my-3"
            >
              <div className="w-full relative">
                <img
                  src={item.img}
                  className="w-full max-h-[400px] object-cover"
                  alt=""
                />
                <div className="flex w-[40%] items-center justify-around absolute left-[50%] translate-x-[-50%] bottom-[-20px]">
                  <BiLogoFacebook className="icon" />
                  <BiLogoTwitter className="icon" />
                  <BiLogoInstagramAlt className="icon" />
                </div>
              </div>
              <p className="text-primary text-[25px] text-center mt-7">
                {item.fullName}
              </p>
              <p className="text-[#666] text-center">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
