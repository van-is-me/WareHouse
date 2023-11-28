import axios from "axios"
import noti from './common/noti'

let token
function checkToken() {
    token = localStorage.getItem('token')
    return token
    // if (token == null) return window.location.href = '/login'
}
checkToken()
const instance = axios.create({
    baseURL: 'https://localhost:5001',
    // baseURL: 'https://warebousebridge.azurewebsites.net/',

    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
})

instance.interceptors.request.use(
    (config) => {
        checkToken()
        config.headers['Authorization'] = 'Bearer ' + token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            noti.error('Phiên đăng nhập đã hết hạn')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default class API {
    // auth
    static login(data) {
        return instance.post('/Login', data)
    }

    static register(data) {
        return instance.post('/Register', data)
    }

    static getInfo() {
        return instance.get(`/api/Account/GetInfor`)
    }

    static confirmEmail(code, userId) {
        return instance.get(`/ConfirmEmail?code=${code}&userId=${userId}`)
    }

    static updateInfo(data) {
        return instance.put(`/UpdateInfo`, data)
    }

    static changePass(pass, passAgain) {
        return instance.put(`/UpdatePassword?pass=${pass}&confirmPass=${passAgain}`)
    }

    // user
    static users() {
        return instance.get(`/api/User/GetListUser`)
    }

    static staffs() {
        return instance.get(`/api/User/GetListStaff`)
    }

    static userById(id) {
        return instance.get(`/api/User/${id}`)
    }

    static updateUserById(id, data) {
        return instance.put(`/api/User/${id}`, data)
    }

    static createStaff(data) {
        return instance.post(`/api/User/CreateStaffAccount`, data)
    }

    // Warehouses
    static warehouses() {
        return instance.get('/api/Warehouses')
    }

    static warehousesByAdmin() {
        return instance.get('/Admin/api/Warehouses')
    }

    static warehouseById(id) {
        return instance.get(`/api/Warehouses/${id}`)
    }

    static warehouseByProvider(providerId) {
        return instance.get(`/api/Warehouses/GetWarehouseByProvider/${providerId}`)
    }

    static warehouseByCategory(categoryId) {
        return instance.get(`/api/Warehouses/GetWarehouseByCategory/${categoryId}`)
    }

    static addWarehouse(data) {
        return instance.post('/Admin/api/Warehouses', data)
    }

    static deleteWarehouse(id) {
        return instance.delete(`/Admin/api/Warehouses/${id}`)
    }

    static updateWarehouse(data) {
        return instance.put(`/Admin/api/Warehouses`, data)
    }

    // warehouse detail
    static warehouseDetails() {
        return instance.get(`/api/WarehouseDetails`)
    }
    static warehouseDetailByID(id) {
        return instance.get(`/api/WarehouseDetails/${id}`)
    }

    static warehouseDetailByWarehouseID(id) {
        return instance.get(`/api/WarehouseDetails/GetWarehouseDetailByWarehouse/${id}`)
    }

    static addWarehouseDetail(data) {
        return instance.post(`/Admin/api/WarehouseDetails`, data)
    }
    static warehouseDetailsByAdmin() {
        return instance.get(`/Admin/api/WarehouseDetails`)
    }
    static whDetailByIDAdmin(id) {
        return instance.get(`/Admin/api/WarehouseDetails/${id}`)
    }
    static updateWarehouseDetailByID(data) {
        return instance.put(`/Admin/api/WarehouseDetails`, data)
    }
    static deleteWarehouseDetailByID(id) {
        return instance.delete(`/Admin/api/WarehouseDetails/${id}`)
    }

    //Rent Warehouse
    static rentWarehouseList() {
        return instance.get(`/api/RentWarehouse`)
    }

    static rentWarehouseDetail(id) {
        return instance.get(`/api/RentWarehouse/${id}`)
    }

    static rentWareHouseAdmin() {
        return instance.get(`/Admin/api/RentWarehouse`)
    }

    static goodById(rentWHId, id) {
        return instance.get(`/Admin/api/Good/${rentWHId}/${id}`)
    }

    static putGood(id, data) {
        return instance.put(`/Admin/api/Good/${id}`, data)
    }

    static deleteGood(rentWarehouseId, id) {
        return instance.delete(`/Admin/api/Good/${rentWarehouseId}/${id}`)
    }

    // provider
    static provider() {
        return instance.get('/api/Providers')
    }

    static providerById(id) {
        return instance.get(`/api/Providers/${id}`)
    }

    // Warehouses detail
    static warehouseDetailById(id) {
        return instance.get(`/api/WarehouseDetails/GetWarehouseDetailByWarehouse/${id}`)
    }

    // Warehouses image
    static imageByWarehouseId(id) {
        return instance.get(`/api/ImageWarehouses/GetImageWarehouseByWarehouse/${id}`)
    }

    //category
    static categories() {
        return instance.get('/api/Categories')
    }

    static addCategory(data) {
        return instance.post('/Admin/api/Categories', data)
    }

    static deleteCategory(id) {
        return instance.delete(`/Admin/api/Categories/${id}`)
    }

    static updateCategory(data) {
        return instance.put('/Admin/api/Categories', data)
    }

    //Provider
    static providers() {
        return instance.get('/api/Providers')
    }

    static addProvider(data) {
        return instance.post('/Admin/api/Providers', data)
    }

    static deleteProvider(id) {
        return instance.delete(`/Admin/api/Providers/${id}`)
    }

    static updateProvider(data) {
        return instance.put('/Admin/api/Providers', data)
    }

    // payment + order

    static getOrder() {
        return instance.get(`/api/Orders`)
    }

    static postOrder(WHId) {
        return instance.post(`/api/Orders?warehouseDetailId=${WHId}`)
    }

    static getOderById(id) {
        return instance.get(`/api/Orders/${id}`)
    }

    static getOrderAdmin() {
        return instance.get(`/Admin/api/Orders`)
    }

    static getOrderDetailAdmin(id) {
        return instance.get(`/Admin/api/Orders/${id}`)
    }

    static assignOrder(idOrder, staffId) {
        return instance.put(`/Admin/api/Orders/AssignOrder/${idOrder}?StaffId=${staffId}`)
    }

    static orderUpdateCall(id) {
        return instance.put(`/Admin/api/Orders/UpdateCall/${id}`)
    }

    static updateOrderStatus(data) {
        return instance.put(`/Admin/api/Orders/UpdateStatus`, data)
    }

    //post
    static posts() {
        return instance.get('/api/Post');
    }

    static providerWareHourse() {
        return instance.get('/api/Providers/QuantityWarehouses');
    }

    static addPost(data) {
        return instance.post(`/api/Post`, data)
    }

    static updatePost(data) {
        return instance.put(`/api/Post`, data)
    }

    static deletePost(id) {
        return instance.delete(`/api/Post/${id}`)
    }

    // post category
    static postCategory() {
        return instance.get(`/api/PostCategory`)
    }

    static addPostCategory() {
        return instance.post(`/api/PostCategory`)
    }

    static updatePostCategory() {
        return instance.put(`/api/PostCategory`)
    }

    static deletePostCategory(id) {
        return instance.delete(`/api/PostCategory/${id}`)
    }

    // enum
    static enumOrdersStatus() {
        return instance.get(`/api/Enum/OrderStatus`)
    }
    static enumGoodUnit() {
        return instance.get('/api/Enum/GoodUnit')
    }
    static enumContractStatus() {
        return instance.get('/api/Enum/ContractStatus')
    }
    static enumDepositStatus() {
        return instance.get('/api/Enum/DepositStatus')
    }

    //hastag
    static getHastags() {
        return instance.get('/api/Hashtag');
    }


    // good
    static goods(rentId) {
        return instance.get(`/api/Good/${rentId}`)
    }

    // hashtag
    static addHastag(data) {
        return instance.post(`/api/Hashtag`, data)
    }

    static deleteHastag(id) {
        return instance.delete(`/api/Hashtag/${id}`)
    }

    static getHastagById(id) {
        return instance.get(`/api/Hashtag/${id}`);
    }

    static updateHastag(data) {
        return instance.put(`/api/Hashtag`, data)
    }

    //deposit
    static deposit() {
        return instance.get(`/Admin/api/Deposit`)
    }

    // contract
    static contracts() {
        return instance.get(`/api/Contract`)
    }

    static contractByAdmin() {
        return instance.get(`/Admin/api/Contract`)
    }

    static addContract(data) {
        return instance.post(`/Admin/api/Contract`, data)
    }

    static updateContract(id, data) {
        return instance.put(`/Admin/api/Contract/${id}`, data)
    }

    //good
    static getGoods() {
        return instance.get('/Admin/api/Good');
    }

    static addGood(data) {
        return instance.post(`/Admin/api/Good`, data)
    }

    //request
    static getRequests() {
        return instance.get('/api/Request');
    }

    static getRequestStatus() {
        return instance.get('/api/Enum/Requeststatus');
    }

    static addRequest(data) {
        return instance.post(`/api/Request`, data)
    }

    static updateRequest(data) {
        return instance.put(`/api/Request`, data)
    }
    static deleteRequest(id) {
        return instance.delete(`/api/Request/${id}`)
    }

    // request detail
    static getRequestDetail(id) {
        return instance.get(`/api/RequestDetail/RequestId?id=${id}`)
    }

    // feedback
    static feedback() {
        return instance.get(`/api/Feedback`)
    }

    static feedbackByID(id) {
        return instance.get(`/api/Feedback/${id}`)
    }

    static postFeedback(whId, data) {
        return instance.post(`/api/Feedback/${whId}`, data);
    }

    static getRequestType() {
        return instance.get('/api/Enum/RequestType');
    }

    //service payment
    static servicePayment() {
        return instance.get(`/api/ServicePayment`)
    }

    static addServicePayment() {
        return instance.post(`/api/ServicePayment`)
    }

    static servicePaymentById(id) {
        return instance.get(`/api/ServicePayment/${id}`)
    }

}
