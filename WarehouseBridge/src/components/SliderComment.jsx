import { useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
function SliderComment({ comments }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const commentsPerPage = 2;

    const handleNext = () => {
        const newIndex = currentIndex + commentsPerPage;
        if (newIndex < comments.length) {
            setCurrentIndex(newIndex);
        } else setCurrentIndex(0)
    };

    const handlePrev = () => {
        const newIndex = currentIndex - commentsPerPage;
        if (newIndex >= 0) {
            setCurrentIndex(newIndex);
        }
    };

    const visibleComments = comments.slice(currentIndex, currentIndex + commentsPerPage);

    return (
        <div className="w-full flex items-center justify-between">
            <button onClick={handlePrev}>
                <AiFillCaretLeft className="btn-secondary text-[40px]"/>
            </button>
            <div className="flex justify-around items-center w-full flex-col lg:flex-row mx-2">
                {visibleComments.map((comment, index) => (
                    <div  key={index} className="w-full lg:w-[45%] bg-white px-4 py-6 my-2">
                        <p className="text-[#666]">{comment?.comment}</p>
                        <div className="flex items-center mt-3">
                            <img src={comment?.avt} className="w-[60px] h-[60px]" alt="" />
                            <div className="ml-6">
                                <p className="text-primary text-[18px] font-bold">{comment?.fullName}</p>
                                <p className="text-[#666]">Đã trải nghiệm: <span className="font-bold">{comment?.warehouse}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleNext}>
                <AiFillCaretRight className="btn-secondary text-[40px]"/>
            </button>
        </div>
    )
}

export default SliderComment