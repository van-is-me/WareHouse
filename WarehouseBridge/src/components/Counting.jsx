import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import '../css/Counting.css'
function Counting({ name, number, icon }) {
    const [isVisible, setIsVisible] = useState(false)
    const [currentNumber, setCurrentNumber] = useState(0)
    const { ref } = useInView({
        triggerOnce: true,
        threshold: 0.5, // Chỉ cần 50% của component hiển thị trong tầm nhìn
        onInView: () => setIsVisible(true)
    })
    if (isVisible) {
        setTimeout(() => {
            const randomJump = Math.floor(Math.random() * 10) + 1
            setCurrentNumber(prevNumber => Math.min(prevNumber + randomJump, number))
        }, 5100)
    }
    return (
        <div ref={ref} className='flex flex-col items-center flex-wrap counting-border w-[120px] px-3 py-2 m-2'>
            {icon}
            <p className='text-primary text-[14px] md:text-[30px] font-bold'>{number}</p>
            <p className='text-[#666] text-[16px]'>{name}</p>
        </div>
    )
}

export default Counting