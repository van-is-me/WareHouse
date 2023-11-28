import { useState } from "react"
import '../css/FormBase.css'
import { TiDeleteOutline } from 'react-icons/ti'
import { Textarea } from "@mantine/core"
import noti from "../common/noti"
function FormBase({ title = [], onSubmit, buttonName, onCancel, totalImage = 4, isDisplayBG = true }) {
    const [formData, setFormData] = useState({
        images: []
    })
    const initialErrors = {}
    title.forEach((inputTitle) => {
        initialErrors[inputTitle.binding] = ''
    })

    const [errors, setErrors] = useState(initialErrors)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: value,
        })

        setErrors({
            ...errors,
            [name]: null,
        })
    }

    const validateFormData = (data) => {
        const newErrors = { ...initialErrors }

        title.forEach((inputTitle) => {
            if (inputTitle.type === 'input' || inputTitle.type === 'area') {
                const fieldValue = data[inputTitle.binding] || ''
                if (!fieldValue.trim()) {
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
            if (onCancel) {
                onCancel()
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (onSubmit) {
            const validationErrors = validateFormData(formData)
            if (Object.keys(validationErrors).every((key) => !validationErrors[key])) {
                onSubmit(formData)
            } else {
                setErrors(validationErrors)
                for (const key in validationErrors) {
                    if (validationErrors[key]) {
                        noti.error(validationErrors[key])
                    }
                }
            }
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;

        const isImage = (file) => file.type.startsWith('image/');

        if (formData.images.length + files.length <= totalImage) {
            const nonImageFiles = Array.from(files).filter((file) => !isImage(file));

            if (nonImageFiles.length === 0) {
                setFormData({
                    ...formData,
                    images: [...formData.images, ...files],
                });
            } else {
                noti.error("Bạn chỉ có thể tải ảnh lên", 2500);
            }
        } else {
            noti.error(`Bạn chỉ có thể thêm tối đa ${totalImage} ảnh`, 2500);
        }
    }


    const handleDeleteImage = (index) => {
        const updatedImages = [...formData.images]
        updatedImages.splice(index, 1)
        setFormData({
            ...formData,
            images: updatedImages,
        })
    }

    return (
        <div className={isDisplayBG ? 'bg-fog' : 'w-full'} onClick={handleCancel}>
            <form className={isDisplayBG ? "hide-scroll w-[95%] md:w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-scroll" : 'w-full max-h-[80vh] overflow-y-scroll hide-scroll'} onSubmit={handleSubmit}>
                {title.map((inputTitle) => (
                    <div className="flex w-[80%] flex-col md:flex-row mx-auto my-4 md:my-2 justify-between" key={inputTitle.name}>
                        <label>{inputTitle.name}</label>
                        {inputTitle.type === 'input' ? (
                            <input
                                className={`input-custom w-full md:w-[50%] ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                                type={inputTitle.binding === 'birthday' ? 'datetime-local' : 'text'} // check for 'birthday' binding
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
                                value={formData[inputTitle.binding] || inputTitle?.options[0]?.id || inputTitle?.defaultValue?.id || ''}
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
                                <input
                                    className={`input-custom w-full ${errors[inputTitle.binding] ? 'border-red-1' : 'border-tran'}`}
                                    type="file"
                                    name={inputTitle.binding}
                                    onChange={handleFileChange}
                                />
                                {formData.images.length > 0 && (
                                    <div className="w-full flex flex-wrap items-center">
                                        {formData.images.map((file, index) => (
                                            <div key={index} className="w-[80px] h-[80px] m-1 overflow-hidden relative">
                                                <img
                                                    className="object-fill w-full"
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Selected Image ${index}`}
                                                />
                                                <TiDeleteOutline onClick={() => handleDeleteImage(index)} className="absolute top-0 right-0 text-[30px] cursor-pointer" />
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

export default FormBase