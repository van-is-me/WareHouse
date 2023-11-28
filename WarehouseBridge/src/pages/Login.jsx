import { useState } from 'react'
import image1 from '../assets/images/kho1.jpg'
import image2 from '../assets/images/kho2.jpg'
import noti from '../common/noti';
import API from '../API';
import { useDispatch, useSelector } from 'react-redux';
import { authen, setRole } from '../reducers/UserReducer'
import { changeLoadingState } from '../reducers/SystemReducer';
import { useNavigate } from 'react-router-dom';
import validate from '../common/validate';
function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isRegister, setIsRegister] = useState(false)
  // const [username, setUsername] = useState('dunghq21')
  // const [password, setPassword] = useState('Dung21102001@')
    // const [username, setUsername] = useState('admin@localhost')
    // const [password, setPassword] = useState('Admin@123')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  const [realUsername, setRealUsername] = useState('')
  const [password2, setPassword2] = useState('')
  const [showP, isShowP] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isValidPass, setIsValidPass] = useState(true)
  const [isValidUsername, setIsValidUsername] = useState(true)
  const login = () => {
    if (username.trim() == '' || password.trim() == '') return noti.error('Email và mật khẩu không được để trống !!!')
    dispatch(changeLoadingState(true))
    API.login({ email: username.trim(), password: password.trim() })
      .then(res => {
        dispatch(authen(res.data))
        dispatch(setRole(res.data?.listRoles[0]))
        localStorage.setItem('user', JSON.stringify(res.data))
        localStorage.setItem('token', res.data?.token)
        localStorage.setItem('role', res.data?.listRoles[0])

        dispatch(changeLoadingState(false))

        if (res.data.listRoles[0] == 'Admin') navigate('/admin')
        else navigate('/')
        noti.success('Đăng nhập thành công', 2000)
      })
      .catch(err => {
        noti.error(err?.response?.data, 3000)
        dispatch(changeLoadingState(false))
      })
  }

  const register = () => {
    console.log(password.length);
    if (password != password2) return noti.error('Mật khẩu không khớp, vui lòng nhập lại mật khẩu!')
    if (password.length < 6) return noti.error('Mật khẩu phải có ít nhất 6 ký tự!')
    if (password2.length < 6) return noti.error('Mật khẩu phải có ít nhất 6 ký tự!')
    if (!/[A-Z]/.test(password)) return noti.error('Mật khẩu phải chứa ít nhất 1 chữ hoa!')
    if (!/[a-z]/.test(password)) return noti.error('Mật khẩu phải chứa ít nhất 1 chữ thường!')
    if (!/\d/.test(password)) return noti.error('Mật khẩu phải chứa ít nhất 1 số!')
    if (!/[!@#$%^&*]/.test(password)) return noti.error('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!')
    if (!validate.email(username)) return noti.error('Bạn phải nhập đúng định dạng email')

    dispatch(changeLoadingState(true))
    API.register({ email: username, password: password, username: realUsername, fullname: 'null', address: 'null', avatar: 'null', phoneNumber: '0900000000', birthday: '1999-09-28T18:25:05.201Z' })
      .then(res => {
        dispatch(changeLoadingState(false))
        noti.success(res.data, 4000)
      })
      .catch(err => {
        noti.error(err.response?.data, 3000)
        dispatch(changeLoadingState(false))
      })
  }

  function validateUsername() {
    if (validate.length(username, 0, 255)
      && validate.emptyString(username)
      && validate.email(username)) return setIsValidEmail(true)
    return setIsValidEmail(false)
  }

  function validateRealUsername() {
    if (validate.length(realUsername, 0, 50)
      && validate.emptyString(realUsername)) return setIsValidUsername(true)
    return setIsValidUsername(false)
  }

  function validatePass(pass) {
    if (validate.length(pass, 0, 255)
      && validate.emptyString(pass)) return setIsValidPass(true)
    return setIsValidPass(false)
  }

  return (
    <div className="w-full flex justify-center py-5 h-screen bg-[#f5f5f3]">
      {!isRegister
        ? <div className="flex w-[97%] md:w-[70%] h-[500px] shadow-lg overflow-hidden">
          <img src={image1} alt="" className='w-[50%] object-cover hidden md:block' />
          <div className='w-full md:w-[50%] flex justify-center items-center bg-white'>
            <div className='w-full flex flex-col items-center'>
              <h1 className='text-[28px] text-[#666] font-bold'>ĐĂNG NHẬP</h1>
              <input type="text" value={username} onBlur={validateUsername} onChange={(e) => setUsername(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidEmail == false ? 'err-in' : ''}`} placeholder='abcd@gmail.com' />
              <input type="password" value={password} onBlur={() => validatePass(password)} onChange={(e) => setPassword(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidPass == false ? 'err-in' : ''}`} placeholder='Mật khẩu' />
              <button className='btn-primary w-[80%] mt-3 px-3 py-2' onClick={login}>Đăng nhập</button>
              <p className='my-3 text-center'>Bạn chưa có tài khoản? <span className='text-[#fea116] cursor-pointer' onClick={() => setIsRegister(!isRegister)}>Đăng ký</span> ngay!</p>
            </div>
          </div>
        </div>
        : <div className="flex w-[97%] md:w-[70%] h-[500px] shadow-lg overflow-hidden">
          <div className='w-full md:w-[50%] flex justify-center items-center bg-white'>
            <div className='w-full flex flex-col items-center'>
              <h1 className='text-[28px] text-[#666] font-bold'>ĐĂNG KÝ</h1>
              <input type="text" value={username} onBlur={validateUsername} onChange={(e) => setUsername(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidEmail == false ? 'err-in' : ''}`} placeholder='abcd@gmail.com' />
              <input type="text" value={realUsername} onBlur={validateRealUsername} onChange={(e) => setRealUsername(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidUsername == false ? 'err-in' : ''}`} placeholder='Tên người dùng' />
              <input type="password" value={password} onBlur={() => validatePass(password)} onChange={(e) => setPassword(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidPass == false ? 'err-in' : ''}`} placeholder='Mật khẩu' />
              <input type="password" value={password2} onBlur={() => validatePass(password2)} onChange={(e) => setPassword2(e.target.value)} className={`input-cus w-[80%] px-3 py-2 my-3 bg-[#eaeaea] ${isValidPass == false ? 'err-in' : ''}`} placeholder='Nhập lại mật khẩu' />
              <button onClick={register} className='btn-primary w-[80%] mt-3 px-3 py-2'>Đăng ký</button>
              <p className='my-3 text-center'>Bạn đã có tài khoản? <span className='text-[#fea116] cursor-pointer' onClick={() => setIsRegister(!isRegister)}>Đăng nhập</span> ngay!</p>
            </div>
          </div>
          <img src={image2} alt="" className='w-[50%] object-cover hidden md:block' />
        </div>}
      {/* <LoadingLocal/> */}
    </div>
  )
}

export default Login