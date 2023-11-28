import React from 'react'
import { MdLocationOn } from 'react-icons/md'
function PinLocation({ text }) {
    return (
        <div className=' w-[100px] relative'>
            <div className='w-full absolute top-[-45px] left-[50%] translate-x-[-50%] text-white text-[12px]'>
                {text}
            </div>
            <MdLocationOn className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-[30px]' />
        </div>
    )
}

export default PinLocation