import { useEffect, useState } from "react";
import '../css/FormBase.css'
import { Textarea } from "@mantine/core";
import noti from "../common/noti";
import { TiDeleteOutline } from "react-icons/ti";

function FormUpdate({ title = [], onSubmit, buttonName, onCancel, initialData, totalImage = 4, isUpdateImage = false }) {
  const [formData, setFormData] = useState({
    images: []
  })
  const initialErrors = {}
  title.forEach((inputTitle) => {
    initialErrors[inputTitle.binding] = ''
  })
  const [errors, setErrors] = useState(initialErrors)


  useEffect(() => {
    if (initialData) {
      // goodImages
      if(initialData.avatar && typeof initialData.avatar == 'string') initialData['image'] = [initialData.avatar]
      setFormData({ ...initialData, images: initialData.image  || [] });
    }
  }, [initialData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: null,
    });
  }

  const validateFormData = (data) => {
    const newErrors = { ...initialErrors }

    title.forEach((inputTitle) => {
      if (inputTitle.type === 'input' || inputTitle.type === 'area') {
        const fieldValue = String(data[inputTitle.binding] || '') // Mặc định giá trị là chuỗi rỗng nếu không tồn tại
        if (!fieldValue?.trim()) {
          newErrors[inputTitle.binding] = 'Lỗi cho trường ' + inputTitle.name
        }
      }
      // Thêm các trường kiểm tra khác tại đây (ví dụ: email, phone).
    })

    setErrors(newErrors)
    return newErrors
  }

  const handleCancel = (event) => {
    if (event.target === event.currentTarget) {
      // Chỉ ẩn FormBase khi nhấn vào "fog", không ẩn khi nhấn nút "Huỷ"
      if (onCancel) {
        onCancel()
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      const validationErrors = validateFormData(formData);
      if (Object.keys(validationErrors).every((key) => !validationErrors[key])) {
        onSubmit(formData)
      } else {
        setErrors(validationErrors);
        for (const key in validationErrors) {
          if (validationErrors[key]) {
            noti.error(validationErrors[key]);
          }
        }
      }
    }
  }

  // const handleFileChange = (event) => {
  //   const files = event.target.files
  //   if (formData.images.length + files.length <= 4) {
  //     setFormData({
  //       ...formData,
  //       images: [...formData.images, ...files],
  //     })
  //   } else noti.error("Bạn chỉ có thể thêm tối đa 4 ảnh", 2500)
  // }


  const handleFileChange = (event) => {
    const files = event.target.files;
    const maxImages = totalImage; // Số lượng ảnh tối đa

    if (formData.images.length + files.length <= maxImages) {
      const newImages = [...formData.images];
      const newImageUrls = [...formData.image]; // Đảm bảo bạn có một mảng imageURL hoặc tương tự

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        // newImages.push(file);
        newImages.push(imageUrl)
        newImageUrls.push(file);
      }

      setFormData({
        ...formData,
        image: newImageUrls,
        images: newImages, // Cập nhật imageUrls nếu bạn sử dụng nó
      });
    } else {
      noti.error(`Bạn chỉ có thể thêm tối đa ${totalImage} ảnh`, 2500);
    }
  };


  // const handleDeleteImage = (index) => {
  //   const updatedImages = [...formData.images]
  //   updatedImages.splice(index, 1)

  //   const updatedImageUrls = [...formData.image]
  //   updatedImageUrls.splice(index, 1)

  //   setFormData({
  //     ...formData,
  //     images: updatedImages,
  //     image: updatedImageUrls,
  //   })
  // }

  const handleDeleteImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    const updatedImageUrls = [...formData.image]
    updatedImageUrls.splice(index, 1)

    setFormData({
      ...formData,
      images: updatedImages,
      image: updatedImageUrls,
    })
  }

  return (
    <div className="bg-fog" onClick={handleCancel}>
      <form className="hide-scroll w-[95%] md:w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-scroll" onSubmit={handleSubmit}>
        {title.map((inputTitle) => (
          <div className="flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between" key={inputTitle.name}>
            <label>{inputTitle.name}</label>
            {inputTitle.type === 'input' ? (
              <input
                className={`input-custom w-full md:w-[50%] ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                type={inputTitle.binding === 'birthday' ? 'datetime-local' : 'text'}
                name={inputTitle.binding}
                value={formData[inputTitle.binding] || ''}
                onChange={handleChange}
              />
            ) : inputTitle.type === 'area' ? (
              <Textarea
                className={`text-custom w-full md:w-[50%] ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                rows={10}
                cols={20}
                name={inputTitle.binding}
                value={formData[inputTitle.binding] || ''}
                onChange={handleChange}
              ></Textarea>
            ) : inputTitle.type === 'select' ? (
              <select
                className={`select-custom w-full md:w-[50%] ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                name={inputTitle.binding}
                value={formData[inputTitle.binding] || inputTitle?.defaultValue?.id || ''}
                onChange={handleChange}
              >
                {inputTitle.options.map((option) => (
                  <option key={option?.id} value={option?.id}>
                    {option?.name || option?.display || option?.fullname}
                  </option>
                ))}
              </select>
            ) : inputTitle.type === 'file' ? (
              <div className="w-full md:w-[50%] flex flex-col">
                {isUpdateImage ? <input
                  className={`input-custom w-full ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                  type="file"
                  name={inputTitle.binding}
                  onChange={handleFileChange}
                /> : null}
                {formData.images && formData.images.length > 0 && (
                  <div className="w-full flex flex-wrap items-center">
                    {formData.images && formData.images.length > 0 && formData.images.map((file, index) => (
                      <div key={index} className="w-[80px] h-[80px] m-1 overflow-hidden relative">
                        <img
                          className="object-fill w-full"
                          // src={URL.createObjectURL(file)}
                          src={file}
                          alt={`Selected Image ${index}`}
                        />
                        {isUpdateImage ? <TiDeleteOutline onClick={() => handleDeleteImage(index)} className="absolute top-0 right-0 text-[30px] cursor-pointer" /> : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
        <div className="w-[80%] mx-auto flex items-center justify-between">
          <div className="btn-cancel px-3 py-1" onClick={handleCancel}>Huỷ</div>
          <button className="btn-primary px-3 py-1" type="submit">{buttonName}</button>
        </div>
      </form>
    </div>
  )
}

export default FormUpdate;