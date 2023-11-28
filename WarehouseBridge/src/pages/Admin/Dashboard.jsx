import { useEffect, useMemo, useState } from "react";
import { FcMoneyTransfer } from "react-icons/fc";
import { GrGroup } from "react-icons/gr";
import { MdOutlineGroups2 } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa";
import PieChart from "../../components/charts/PieChart";
import API from "../../API";
import { MantineReactTable } from "mantine-react-table";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../reducers/SystemReducer";
import func from "../../common/func";
import BarChart from "../../components/charts/BarChart";
import LineChart from "../../components/charts/LineChart";

function Dashboard() {
  const dispatch = useDispatch();
  const [deposit, setDeposit] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [WH, setWH] = useState(0);
  const [user, setUser] = useState(0);
  const [partner, setPartner] = useState(0);
  const [listCounting, setListCounting] = useState([]);

  useEffect(() => {
    fetchDeposit();
    fetchListWarehouse();
    fetchUser();
    fetchListProvider();

    setListCounting([
      {
        id: 1,
        name: "Doanh thu",
        number: func.convertVND(revenue),
        icon: <FcMoneyTransfer className="text-[26px]" />,
      },
      {
        id: 4,
        name: "Kho",
        number: WH,
        icon: <FaWarehouse className="text-[26px] text-[#0f1728]" />,
      },
      {
        id: 2,
        name: "Khách hàng",
        number: user,
        icon: <GrGroup className="text-[26px] text-[#ff7f61]" />,
      },
      {
        id: 3,
        name: "Đối tác",
        number: partner,
        icon: <MdOutlineGroups2 className="text-[26px] text-[#efae4e]" />,
      },
    ]);
  }, [revenue, WH, user, partner]);

  const fetchDeposit = () => {
    dispatch(changeLoadingState(true));
    API.deposit()
      .then((res) => {
        dispatch(changeLoadingState(false));
        let tmpList;
        if (Array.isArray(res.data)) tmpList = res.data.reverse();
        setDeposit(tmpList);
        let tmpRevenue = 0;
        res.data.map((item) => {
          tmpRevenue = tmpRevenue + item?.amount;
        });
        setRevenue(tmpRevenue);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  function fetchListWarehouse() {
    dispatch(changeLoadingState(true));
    API.warehousesByAdmin()
      .then((res) => {
        dispatch(changeLoadingState(false));
        setWH(res.data.length);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  }

  const fetchUser = () => {
    dispatch(changeLoadingState(true));
    API.users()
      .then((res) => {
        setUser(res.data.length);
        dispatch(changeLoadingState(false));
      })
      .catch((er) => dispatch(changeLoadingState(false)));
  };

  function fetchListProvider() {
    dispatch(changeLoadingState(true));
    API.providers()
      .then((res) => {
        setPartner(res.data.length);
        dispatch(changeLoadingState(false));
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        Cell: ({ cell, row }) => <div>...</div>,
      },
      {
        accessorKey: "order.customer.fullname",
        header: "Khách hàng",
      },
      {
        accessorKey: "order.customer.userName",
        header: "Tên tài khoản",
      },
      {
        accessorKey: "order.customer.email",
        header: "Email",
      },
      {
        accessorKey: "orderInfo",
        header: "Thông tin đơn hàng",
      },
      {
        accessorKey: "paymentMethod",
        header: "Phương thức thanh toán",
      },
      {
        accessorKey: "amount",
        header: "Số tiền",
        Cell: ({ cell, row }) => <div>{func.convertVND(cell.getValue())}</div>,
      },
      {
        accessorKey: "creationDate",
        header: "Ngày tạo",
        Cell: ({ cell, row }) => <div>{func.convertDate(cell.getValue())}</div>,
      },
      {
        accessorKey: "status",
        header: "Trạng thái giao dịch",
        Cell: ({ cell, row }) => (
          <div>{cell.getValue() == 1 ? "Thành công" : "Thất bại"}</div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-[90%] mx-auto mt-[40px]">
      {/* counting */}
      <div className="grid grid-cols-12 gap-3 w-full">
        {listCounting.map((i) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-[#faf9f9] rounded-md hover:translate-y-[-5px] transition-transform h-[160px] shadow-lg"
            key={i.id}
          >
            <p className="w-full text-[#878a99] text-[18px] m-4">{i.name}</p>
            <p className="text-[24px] text-black mt-5 ml-4">{i.number}</p>
            <div className="flex items-center w-full px-4 mt-5 justify-between">
              <span className="underline cursor-pointer text-[#687cfe]">
                Xem chi tiết
              </span>
              {i.icon}
            </div>
          </div>
        ))}
      </div>
      {/* chart */}
      {/* <div className="w-full flex flex-col md:flex-row flex-wrap mt-10 justify-between">
        <div className="w-full md:w-[40%] rounded-md shadow-lg p-4 bg-[#faf9f9] flex items-center justify-center">
          <PieChart />
        </div>
        <div className="w-full md:w-[55%] mt-4 md:mt-0 rounded-md shadow-lg p-4 bg-[#faf9f9] flex items-center justify-center">
          <BarChart />
        </div>
        <div className="w-full mt-6 max-h-[500px] rounded-md shadow-lg p-4 bg-[#faf9f9] flex items-center justify-center">
          <LineChart />
        </div>
      </div> */}

      {/* deposit */}
      <div className="w-full mt-10">
        <span className="text-[36px] text-primary font-bold">Ký gửi</span>
        <div className="w-full mx-auto mt-2">
          <MantineReactTable
            columns={columns}
            initialState={{ columnVisibility: { id: false } }}
            data={deposit}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
