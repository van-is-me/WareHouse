import imgNotFound from '../assets/images/notfound.jpg'
function NotFound() {
  return (
    <div className='w-full flex items-center justify-center min-h-screen'>
      <img src={imgNotFound} alt=''/>
    </div>
  )
}

export default NotFound