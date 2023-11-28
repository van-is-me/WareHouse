import { Route, Routes } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import AdminBlog from '../pages/Admin/AdminBlog'
import AdminWarehouse from '../pages/Admin/AdminWarehouse'
import AdminCategory from '../pages/Admin/AdminCategory'
import AdminPartner from '../pages/Admin/AdminPartner'
import Sidebar from "../components/Sidebar"
import { useEffect, useState } from "react"
import Dashboard from "./Admin/Dashboard"
import AdminWarehouseDetail from "./Admin/AdminWarehouseDetail"
import AdminOrder from "./Admin/AdminOrder"
import AdminContract from "./Admin/AdminContract"
import AdminGoods from './Admin/AdminGoods'
import AdminHashtag from './Admin/AdminHashtag'
import AdminUser from "./Admin/AdminUser"
import AdminRequest from "./Admin/AdminRequest"
import AdminRequestDetails from "./Admin/AdminRequestDetail"

function Admin() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
        // if (window.innerWidth > 767) setWindowWidth(window.innerWidth - 60)
        // else setWindowWidth(window.innerWidth)
        setWindowWidth(window.innerWidth - 60)
    }


    return (
        <div className="w-full ">
            <Sidebar />
            <AdminHeader />
            <div className="float-right" style={{ width: `${windowWidth}px` }}>
                <Routes>
                    <Route index path="/admin-dashboard" element={<Dashboard />} />
                    <Route path="/admin-warehouses" element={<AdminWarehouse />} />
                    <Route path="/admin-users" element={<AdminUser />} />
                    <Route path="/admin-warehouses-details" element={<AdminWarehouseDetail />} />
                    <Route path="/admin-orders" element={<AdminOrder />} />
                    <Route path="/admin-categories" element={<AdminCategory />} />
                    <Route path="/admin-partners" element={<AdminPartner />} />
                    <Route path="/admin-blogs" element={<AdminBlog />} />
                    <Route path="/admin-hashtags" element={<AdminHashtag />} />
                    <Route path="/admin-contracts" element={<AdminContract />} />
                    <Route path="/admin-goods" element={<AdminGoods />} />
                    <Route path="/admin-requests" element={<AdminRequest />} />
                    <Route path="/admin-request-details" element={<AdminRequestDetails />} />
                </Routes>
            </div>
        </div>
    )
}

export default Admin