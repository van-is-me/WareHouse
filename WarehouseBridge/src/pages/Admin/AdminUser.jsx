import { MantineReactTable } from "mantine-react-table";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import API from "../../API";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../reducers/SystemReducer";
import { AiOutlineEdit } from "react-icons/ai";
import func from "../../common/func";
import FormBase from "../../components/FormBase";
import FormUpdate from "../../components/FormUpdate";
import noti from "../../common/noti";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "react-confirm-alert/src/react-confirm-alert.css";
import { downloadExcel } from "react-export-table-to-excel";

function AdminUser() {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [listStaff, setListStaff] = useState([]);
  const [detailUser, setDetailUser] = useState({});
  const [detailStaff, setDetailStaff] = useState({});
  const [isAddUser, setIsAddUser] = useState(false);
  const [isAddStaff, setIsAddStaff] = useState(false);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [isUpdateStaff, setIsUpdateStaff] = useState(false);
  const [isShowContract, setIsShowContract] = useState(false);
  const [formDataUser, setFormDataUser] = useState([
    { name: "Tên người dùng", binding: "username", type: "input" },
    { name: "Tên", binding: "fullname", type: "input" },
    { name: "email", binding: "email", type: "input" },
    { name: "Số điện thoại", binding: "phoneNumber", type: "input" },
    { name: "Địa chỉ", binding: "address", type: "input" },
    { name: "Sinh nhật", binding: "birthday", type: "input" },
    { name: "Ảnh đại diện", binding: "avatar", type: "file" },
  ]);

  const [formDataStaff, setFormDataStaff] = useState([
    { name: "Tên người dùng", binding: "username", type: "input" },
    { name: "Tên", binding: "fullname", type: "input" },
    { name: "email", binding: "email", type: "input" },
    { name: "Số điện thoại", binding: "phoneNumber", type: "input" },
    { name: "Địa chỉ", binding: "address", type: "input" },
    { name: "Sinh nhật", binding: "birthday", type: "input" },
    { name: "Ảnh đại diện", binding: "avatar", type: "file" },
  ]);

  const [excelList, setExcelList] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchStaff();
  }, []);

  const fetchUser = () => {
    dispatch(changeLoadingState(true));
    API.users()
      .then((res) => {
        setList(res.data);
        let tmpList = [];
        res.data.map((item) => {
          tmpList.push({
            fullname: item?.fullname,
            email: item?.email,
            phoneNumber: item?.phoneNumber,
            birthday: func.convertDate(item?.birthday),
            address: item?.address,
          });
        });
        setExcelList(tmpList)
        dispatch(changeLoadingState(false));
      })
      .catch((er) => dispatch(changeLoadingState(false)));
  };

  const fetchStaff = () => {
    dispatch(changeLoadingState(true));
    API.staffs()
      .then((res) => {
        setListStaff(res.data);
        dispatch(changeLoadingState(false));
      })
      .catch((er) => dispatch(changeLoadingState(false)));
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        Cell: ({ cell, row }) => <div>...</div>,
      },
      {
        accessorKey: "userName",
        header: "Tên người dùng",
      },
      {
        accessorKey: "fullname",
        header: "Họ và tên",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "emailConfirmed",
        header: "Xác thực email",
        Cell: ({ cell, row }) => (
          <div>{cell.getValue() == true ? "Đã xác thực" : "Chưa xác thực"}</div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
      },
      {
        accessorKey: "birthday",
        header: "Sinh nhật",
        Cell: ({ cell, row }) => <div>{func.convertDate(cell.getValue())}</div>,
      },
      {
        accessorKey: "avatar",
        header: "Ảnh đại diện",
        Cell: ({ cell, row }) => (
          <div>
            <img
              className="w-[100px] h-[100px] object-cover"
              src={
                cell.getValue() != "null"
                  ? cell.getValue()
                  : "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0"
              }
              alt="avt staff"
            />
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Địa chỉ",
        size: 300,
      },
    ],
    []
  );

  const handleCancel = () => {
    setIsAddUser(false);
    setIsAddStaff(false);
    setIsUpdateStaff(false);
    setIsUpdateUser(false);
  };

  const actionAdd = () => {
    setIsAddStaff(true);
  };

  const addStaff = (data) => {
    dispatch(changeLoadingState(true));
    if (data.images) {
      const storageRef = ref(
        storage,
        "avatars/" + data.username + "-" + Date.now()
      );
      const imageFile = data.images[0];
      uploadBytes(storageRef, imageFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              data.avatar = downloadURL;
              createStaff(data);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              dispatch(changeLoadingState(false));
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          dispatch(changeLoadingState(false));
        });
    } else {
      data.avatar = "null";
      createStaff(data);
    }
  };

  const createStaff = (data) => {
    dispatch(changeLoadingState(true));
    API.createStaff({
      email: data?.email,
      username: data?.username,
      fullname: data.fullname,
      address: data.address,
      avatar: data.avatar,
      phoneNumber: data?.phoneNumber,
      password: "Staff1!",
      birthday: data?.birthday,
    })
      .then((res) => {
        noti.success("Tạo nhân viên thành công");
        dispatch(changeLoadingState(false));
        fetchStaff();
        handleCancel();
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error("Đã xảy ra lỗi, vui lòng thử lại");
      });
  };

  const getDetail = (data) => {
    setIsUpdateUser(true);
    dispatch(changeLoadingState(true));
    API.userById(data.getValue("id"))
      .then((res) => {
        dispatch(changeLoadingState(false));
        setDetailUser(res.data);
      })
      .catch((err) => dispatch(changeLoadingState(false)));
  };

  const updateUser = (data) => {
    dispatch(changeLoadingState(true));

    if (data.images && data.images[0] instanceof File) {
      const storageRef = ref(
        storage,
        "avatars/" + data.username + "-" + Date.now()
      );
      const imageFile = data.images[0];

      uploadBytes(storageRef, imageFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              data.avatar = downloadURL;
              updateUData(data);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              dispatch(changeLoadingState(false));
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          dispatch(changeLoadingState(false));
        });
    } else {
      data.avatar = data.images ? data.images[0] : "null";
      updateUData(data);
    }
  };

  const updateUData = (data) => {
    API.updateUserById(data?.id, {
      fullname: data?.fullname,
      address: data?.address,
      avatar: data?.avatar,
      birthday: data?.birthday,
      username: data?.username,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    })
      .then((res) => {
        noti.success("Chỉnh sửa người dùng thành công");
        fetchUser();
        handleCancel();
        dispatch(changeLoadingState(false));
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error(err?.response?.data);
      });
  };
  // const handleDeleteRow = (data) => { }

  const getDetailStaff = (data) => {
    setIsUpdateStaff(true);
    dispatch(changeLoadingState(true));
    API.userById(data.getValue("id"))
      .then((res) => {
        dispatch(changeLoadingState(false));
        setDetailStaff(res.data);
      })
      .catch((err) => dispatch(changeLoadingState(false)));
  };

  const updateStaff = (data) => {
    dispatch(changeLoadingState(true));

    if (data.images && data.images[0] instanceof File) {
      const storageRef = ref(
        storage,
        "avatars/" + data.username + "-" + Date.now()
      );
      const imageFile = data.images[0];

      uploadBytes(storageRef, imageFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              data.avatar = downloadURL;
              updateStaffData(data);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              dispatch(changeLoadingState(false));
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          dispatch(changeLoadingState(false));
        });
    } else {
      data.avatar = data.images ? data.images[0] : "null";
      updateStaffData(data);
    }
  };

  const updateStaffData = (data) => {
    API.updateUserById(data?.id, {
      fullname: data?.fullname,
      address: data?.address,
      avatar: data?.avatar,
      birthday: data?.birthday,
      username: data?.username,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
    })
      .then((res) => {
        noti.success("Chỉnh sửa người dùng thành công");
        fetchStaff();
        handleCancel();
        dispatch(changeLoadingState(false));
      })
      .catch((err) => dispatch(changeLoadingState(false)));
  };

  const showContract = (data) => {
    setIsShowContract(true);
  };

  // const handleDeleteRowStaff = (data) => {
  //     confirmAlert({
  //         customUI: ({ onClose }) => {
  //           return (
  //             <div className='bg-[#f7f7f7] rounded-md p-4 shadow-md'>
  //               <p className="text-[24px]">Bạn có chắc chắn muốn xoá <br /> 	&quot;{data.getValue('name')}&quot; ?</p>
  //               <div className="w-full flex justify-end mt-3">
  //                 <button className="px-3 py-1 mr-2 rounded-md btn-cancel" onClick={onClose}>Huỷ</button>
  //                 <button
  //                   className="px-3 py-1 rounded-md btn-primary"
  //                   onClick={() => {
  //                     deleteWH(data.getValue('id'))
  //                     onClose()
  //                   }}
  //                 >
  //                   Xoá
  //                 </button>
  //               </div>
  //             </div>
  //           )
  //         }
  //       })
  //  }

  const header = ["fullname", "email", "phoneNumber", "birthday", "address"];

  const exportExcel = () => {
    downloadExcel({
      fileName: "user-data",
      sheet: "user-data",
      tablePayload: {
        header,
        body: excelList,
      },
    });
  };

  return (
    <div className="w-full">
      {/* user */}
      <div className=" w-full md:w-[90%] mx-auto mt-10">
        <button className="btn-primary px-3 py-1 my-2" onClick={exportExcel}>
          Xuất tệp Excel
        </button>

        <MantineReactTable
          columns={columns}
          initialState={{ columnVisibility: { id: false } }}
          data={list}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className="flex items-center">
              <button onClick={() => getDetail(row)} className="">
                <AiOutlineEdit className="edit-icon" />
              </button>
              {/* <button onClick={() => showContract(row)} className="">
                <IoMdPaper className="ml-1 text-primary text-[24px]" />
              </button> */}
            </div>
          )}
        />
      </div>

      {/* staff */}
      <div className=" w-full md:w-[90%] mx-auto mt-10">
        <button className="btn-primary px-3 py-1 my-2" onClick={actionAdd}>
          Thêm quản lý
        </button>
        <MantineReactTable
          columns={columns}
          initialState={{ columnVisibility: { id: false } }}
          data={listStaff}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className="flex items-center">
              <button onClick={() => getDetailStaff(row)} className="">
                <AiOutlineEdit className="edit-icon" />
              </button>
              {/* <button onClick={() => handleDeleteRowStaff(row)} className=''><MdDelete className='del-icon' /></button> */}
            </div>
          )}
        />
      </div>
      {isAddStaff ? (
        <FormBase
          title={formDataStaff}
          onSubmit={addStaff}
          buttonName={"Thêm mới"}
          onCancel={handleCancel}
          totalImage={1}
        />
      ) : null}
      {isUpdateStaff ? (
        <FormUpdate
          title={formDataStaff}
          onSubmit={updateStaff}
          buttonName={"Chỉnh sửa"}
          initialData={detailStaff}
          onCancel={handleCancel}
          totalImage={1}
          isUpdateImage={true}
        />
      ) : null}
      {isUpdateUser ? (
        <FormUpdate
          title={formDataUser}
          onSubmit={updateUser}
          buttonName={"Chỉnh sửa"}
          initialData={detailUser}
          onCancel={handleCancel}
          totalImage={1}
          isUpdateImage={true}
        />
      ) : null}
    </div>
  );
}

export default AdminUser;
