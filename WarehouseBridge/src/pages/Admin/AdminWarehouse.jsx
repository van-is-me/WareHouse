import { useEffect, useMemo, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import API from "../../API";
import noti from "../../common/noti";
import { useDispatch } from "react-redux";
import { changeLoadingState } from "../../reducers/SystemReducer";
import FormBase from "../../components/FormBase";
import FormUpdate from "../../components/FormUpdate";
import { AiOutlineEdit, AiOutlineCloseSquare } from "react-icons/ai";
import { MdDelete, MdMoveToInbox } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import SubWHPage from "./SubWHPage";

function AdminWarehouse() {
  const [list, setList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [isShowUpdate, setIsShowUpdate] = useState(false);
  const [isShowDetailList, setIsSHowDetailList] = useState(false);
  const [selectedWH, setSelectedWH] = useState({});
  const [listProvider, setListProvider] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [rentWH, setRentWH] = useState([]);
  const [detailWH, setDetailWH] = useState(null);
  const [formData, setFormData] = useState([
    { name: "Tên", binding: "name", type: "input" },
    { name: "Mô tả ngắn", binding: "shortDescription", type: "area" },
    { name: "Mô tả chi tiết", binding: "description", type: "area" },
    { name: "Địa chỉ", binding: "address", type: "input" },
    { name: "Kinh độ", binding: "longitudeIP", type: "input" },
    { name: "Vĩ độ", binding: "latitudeIP", type: "input" },
    { name: "Hình ảnh", binding: "image", type: "file" },
    {
      name: "Nhà cung cấp",
      binding: "providerId",
      type: "select",
      options: [1, 2, 3],
      defaultValue: "",
    },
    {
      name: "Danh mục",
      binding: "categoryId",
      type: "select",
      options: [1, 2, 3],
      defaultValue: "",
    },
  ]);

  const [isShowAddGood, setIsShowAddGood] = useState(false);
  const [rentWHId, setRentWHId] = useState("");
  const [formDataGood, setFormDataGood] = useState([
    { name: "Tên", binding: "goodName", type: "input" },
    { name: "Số lượng", binding: "quantity", type: "input" },
    { name: "Mô tả", binding: "description", type: "input" },
    { name: "Hình ảnh", binding: "image", type: "file" },
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchListWarehouse();
    fetchListProvider();
    fetchListCategory();
    fetchRentWH();
  }, []);

  useEffect(() => {
    if (listProvider.length > 0 && listCategory.length > 0) {
      setFormData([
        { name: "Tên", binding: "name", type: "input" },
        { name: "Mô tả ngắn", binding: "shortDescription", type: "area" },
        { name: "Mô tả chi tiết", binding: "description", type: "area" },
        { name: "Địa chỉ", binding: "address", type: "input" },
        { name: "Kinh độ", binding: "longitudeIP", type: "input" },
        { name: "Vĩ độ", binding: "latitudeIP", type: "input" },
        { name: "Hình ảnh", binding: "image", type: "file" },
        {
          name: "Nhà cung cấp",
          binding: "providerId",
          type: "select",
          options: listProvider,
          defaultValue: listProvider[0],
        },
        {
          name: "Danh mục",
          binding: "categoryId",
          type: "select",
          options: listCategory,
          defaultValue: listCategory[0],
        },
      ]);
    }
  }, [listProvider, listCategory]);

  const fetchRentWH = () => {
    dispatch(changeLoadingState(true));

    API.rentWareHouseAdmin()
      .then((res) => {
        setRentWH(res.data);
        dispatch(changeLoadingState(false));
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });
  };

  const getDetailWH = (data) => {
    // console.log(data.original)
    let tmpData;
    dispatch(changeLoadingState(true));
    API.warehouseById(data.original.id)
      .then((res) => {
        dispatch(changeLoadingState(false));
        tmpData = res.data;
        tmpData["image"] = [];

        API.imageByWarehouseId(data.original.id)
          .then((res) => {
            res.data.map((item) => {
              tmpData.image.push(item?.imageURL);
            });
            setDetailWH(tmpData);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
      });

    setIsShowUpdate(true);
  };

  async function updateWH(data) {
    if (Array.isArray(data?.image)) {
      // const imageUrls = []

      // for (const imageItem of data.image) {
      //   if (imageItem instanceof File) {
      //     // Đây là một object File, bạn có thể tải lên Firebase Storage
      //     const imageName = `${new Date().getTime()}_${imageItem.name}`
      //     const imageRef = ref(storage, `images/${imageName}`)
      //     await uploadBytes(imageRef, imageItem)
      //     const imageUrl = await getDownloadURL(imageRef)
      //     imageUrls.push(imageUrl)
      //   } else if (typeof imageItem === 'string') {
      //     // Đây là một URL hình ảnh, bạn có thể xử lý nó tùy ý
      //     imageUrls.push(imageItem)
      //   }
      // }
      // Bây giờ imageUrls sẽ chứa URL của tất cả các hình ảnh đã tải lên Firebase Storage.
      // có thể sử dụng imageUrls khi cần thiết.

      const finalData = {
        id: data?.id,
        providerId: data?.providerId,
        categoryId: data?.categoryId,
        name: data?.name,
        address: data?.address,
        description: data?.description,
        shortDescription: data?.shortDescription,
        longitudeIP: data?.longitudeIP,
        latitudeIP: data?.latitudeIP,
        isDisplay: true,
      };
      dispatch(changeLoadingState(true));
      API.updateWarehouse(finalData)
        .then((res) => {
          noti.success(res.data);
          dispatch(changeLoadingState(false));
          handleCancel();
          fetchListWarehouse();
        })
        .catch((err) => {
          noti.error(err?.response?.data?.errors[0]);
          dispatch(changeLoadingState(false));
        });
    }
  }

  function fetchListWarehouse() {
    dispatch(changeLoadingState(true));
    API.warehousesByAdmin()
      .then((res) => {
        dispatch(changeLoadingState(false));
        setList(res.data);
      })
      .catch((err) => {
        dispatch(changeLoadingState(false));
        noti.error(err.response?.data);
      });
  }

  function fetchListProvider() {
    API.provider()
      .then((res) => {
        setListProvider(res.data);
      })
      .catch((err) => {
        noti.error(err.response?.data);
      });
  }

  function fetchListCategory() {
    API.categories()
      .then((res) => {
        setListCategory(res.data);
      })
      .catch((err) => {});
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        Cell: ({ cell, row }) => <div>...</div>,
      },
      {
        accessorKey: "name",
        header: "Tên",
      },
      {
        accessorKey: "shortDescription",
        header: "Mô tả ngắn",
        size: 400,
      },
      {
        accessorKey: "description",
        header: "Mô tả chi tiết",
        size: 800,
      },
      {
        accessorKey: "address",
        header: "Địa chỉ",
        size: 300,
      },
      {
        accessorKey: "latitudeIP",
        header: "Vĩ độ",
      },
      {
        accessorKey: "longitudeIP",
        header: "Kinh độ",
      },
      {
        accessorKey: "isDisplay",
        header: "Trạng thái hiển thị",
        Cell: ({ cell, row }) => (
          <div>{cell.getValue() == true ? "Đang hiển thị" : "Đang ẩn"}</div>
        ),
      },
    ],
    []
  );

  const columnsRentWH = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        Cell: ({ cell, row }) => <div>...</div>,
      },
      {
        accessorKey: "information",
        header: "Thông tin",
      },
      {
        accessorKey: "rentStatus",
        header: "Trạng thái thuê",
        Cell: ({ cell, row }) => (
          <div>{cell.getValue() == 1 ? "Chờ xử lý" : "Hết hạn"}</div>
        ),
      },
    ],
    []
  );

  const handleCancel = () => {
    setIsShow(false);
    setIsShowUpdate(false);
    setIsShowAddGood(false);
    setRentWHId("");
  };

  const actionAdd = () => {
    setIsShow(true);
  };

  const addWarehouse = async (data) => {
    const images = data.images;
    if (images.length != 0) {
      dispatch(changeLoadingState(true));
      try {
        const imageUrls = await Promise.all(
          images.map(async (image) => {
            const imageName = `${new Date().getTime()}_${image.name}`;
            const imageRef = ref(storage, `images/${imageName}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            return imageUrl;
          })
        );

        const finalData = {
          warehourse: {
            providerId: data.providerId || listProvider[0]?.id,
            categoryId: data.categoryId || listCategory[0]?.id,
            name: data.name,
            address: data.address,
            description: data.description,
            shortDescription: data.shortDescription,
            longitudeIP: data.longitudeIP,
            latitudeIP: data.latitudeIP,
          },
          listImages: imageUrls,
        };

        API.addWarehouse(finalData)
          .then((res) => {
            fetchListWarehouse();
            setIsShow(false);
            noti.success(res.data, 3000);
          })
          .catch((err) => {
            noti.error(err.response?.data, 3000);
          });
        dispatch(changeLoadingState(false));
      } catch (error) {
        console.log("Lỗi khi tải lên ảnh" + error, 3000);
      }
    } else noti.error("Bạn phải thêm ít nhất 1 ảnh để tạo kho!", 2500);
  };

  const handleDeleteRow = (data) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-[#f7f7f7] rounded-md p-4 shadow-md">
            <p className="text-[24px]">
              Bạn có chắc chắn muốn xoá <br /> &quot;{data.getValue("name")}
              &quot; ?
            </p>
            <div className="w-full flex justify-end mt-3">
              <button
                className="px-3 py-1 mr-2 rounded-md btn-cancel"
                onClick={onClose}
              >
                Huỷ
              </button>
              <button
                className="px-3 py-1 rounded-md btn-primary"
                onClick={() => {
                  deleteWH(data.getValue("id"));
                  onClose();
                }}
              >
                Xoá
              </button>
            </div>
          </div>
        );
      },
    });
  };

  const deleteWH = (id) => {
    API.deleteWarehouse(id)
      .then((res) => {
        fetchListWarehouse();
        noti.success(res.data);
      })
      .catch((err) => {
        noti.error(err.response?.data);
      });
  };

  const getDetailWHByID = (data) => {
    // dispatch(changeLoadingState(true))
    // API.warehouseDetailByWarehouseID(data.getValue('id'))
    //   .then(res => {
    //     setSelectedWH(res.data)
    //     dispatch(changeLoadingState(false))
    //   })
    //   .catch(err => dispatch(changeLoadingState(false)))
    setIsSHowDetailList(true);
    setSelectedWH(data.getValue("id"));
  };

  const addGood = (data) => {
    setIsShowAddGood(true);
    setRentWHId(data.getValue("id"));
  };

  const handleAddGood = async (data) => {
    const images = data.images;
    if (images.length != 0) {
      dispatch(changeLoadingState(true));
      try {
        const imageUrls = await Promise.all(
          images.map(async (image) => {
            const imageName = `${new Date().getTime()}_${image.name}`;
            const imageRef = ref(storage, `images/${imageName}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            return imageUrl;
          })
        );

        const finalData = {
          goodCreateModel: {
            rentWarehouseId: rentWHId,
            goodName: data.goodName,
            quantity: data.quantity,
            goodUnit: 1,
            description: data.description,
          },
          images: imageUrls,
        };

        API.addGood(finalData)
          .then((res) => {
            handleCancel();
            noti.success(res.data);
          })
          .catch((err) => {
            noti.error(err.response?.data);
          });
        dispatch(changeLoadingState(false));
      } catch (error) {
        console.log("Lỗi khi tải lên ảnh" + error, 3000);
      }
    } else noti.error("Bạn phải thêm ít nhất 1 ảnh để tạo hàng hoá!", 2500);
  };
  return (
    <div className="w-full">
      <div className=" w-full md:w-[90%] mx-auto mt-10">
        <button className="btn-primary px-3 py-1 my-2" onClick={actionAdd}>
          Thêm
        </button>
        <MantineReactTable
          columns={columns}
          data={list}
          initialState={{ columnVisibility: { id: false } }}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className="flex items-center">
              <button onClick={() => getDetailWHByID(row)}>
                <BiDetail className="text-[24px] text-secondary" />
              </button>
              <button onClick={() => getDetailWH(row)} className="">
                <AiOutlineEdit className="edit-icon" />
              </button>
              <button onClick={() => handleDeleteRow(row)} className="">
                <MdDelete className="del-icon" />
              </button>
            </div>
          )}
        />
      </div>

      <div className=" w-full md:w-[90%] mx-auto mt-10">
        <MantineReactTable
          columns={columnsRentWH}
          data={rentWH}
          initialState={{ columnVisibility: { id: false } }}
          enableEditing
          renderRowActions={({ row, table }) => (
            <div className="flex items-center">
              <button onClick={() => addGood(row)}>
                <MdMoveToInbox className="text-[24px] text-primary" />
              </button>
            </div>
          )}
        />
      </div>

      {isShowUpdate ? (
        <FormUpdate
          title={formData}
          onSubmit={updateWH}
          buttonName={"Chỉnh sửa"}
          initialData={detailWH}
          onCancel={handleCancel}
        />
      ) : null}
      {isShow ? (
        <FormBase
          title={formData}
          onSubmit={addWarehouse}
          buttonName={"Thêm mới"}
          onCancel={handleCancel}
        />
      ) : (
        ""
      )}
      {isShowAddGood ? (
        <FormBase
          title={formDataGood}
          onSubmit={handleAddGood}
          buttonName={"Thêm mới"}
          onCancel={handleCancel}
          totalImage={1}
        />
      ) : (
        ""
      )}
      {isShowDetailList ? (
        <div className="bg-fog-cus">
          <div className="w-[95%] bg-white lg:w-[90%] min-h-[90vh] relative">
            <AiOutlineCloseSquare
              onClick={() => setIsSHowDetailList(false)}
              className="cursor-pointer text-[24px] absolute right-4 top-4"
            />
            <SubWHPage id={selectedWH} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminWarehouse;
