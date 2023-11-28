import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Partner from "./pages/Partner";
import Warehouse from "./pages/Warehouse";
import News from "./pages/News";
import Contact from "./pages/Contact";
import WarehouseList from "./pages/WarehouseList";
import Profile from "./pages/Profile";
import PartnerProfile from "./pages/PartnerProfile";
import WarehouseDetail from "./pages/WarehouseDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingLocal from "./components/LoadingLocal";
import { useSelector } from "react-redux";
import ConfirmEmail from "./pages/ConfirmEmail";
import Admin from "./pages/Admin";
import { useMemo } from "react";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
function App() {
  const system = useSelector((state) => state.system);
  const user = useSelector((state) => state.auth);
  // const [pathname, setPathname] = useState('')
  const location = useLocation();
  const { hash, pathname, search } = location;

  // const CheckAuth = ({ children }) => {
  //   if (user.auth && user.role != 'Admin') return <Navigate to={'/'} />
  //   if (user.auth && user.role == 'Admin') return <Navigate to={'/admin'} />
  //   else return children
  // }
  const CheckAuth = useMemo(() => {
    return ({ children }) => {
      // if (user.auth && user.role != 'Admin') return <Navigate to={'/'} />
      if (user.auth && user.role == "Admin")
        return <Navigate to={"/admin/admin-dashboard"} />;
      return children;
    };
  }, [user]);

  const CheckLogined = useMemo(() => {
    return ({ children }) => {
      if (!user.auth) return <Navigate to={"/"} />;
      return children;
    };
  }, [user]);

  // const CheckPermission = ({ children }) => {
  //   if (!user.auth || user.role != 'Admin') return <Navigate to={'/'} />
  //   return children
  // }

  const CheckPermission = useMemo(() => {
    return ({ children }) => {
      if (!user.auth || user.role != "Admin") return <Navigate to={"/"} />;
      return children;
    };
  }, [user]);

  return (
    <>
      <div className="w-full">
        {(user.role && user.role == "Admin") ||
        pathname == "/welcome" ? null : (
          <Header />
        )}
        <div className="w-full min-h-screen">
          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <CheckAuth>
                  <Home />
                </CheckAuth>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/warehouse/:name" element={<WarehouseList />} />
            <Route path="/warehouse-detail/:id" element={<WarehouseDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <CheckLogined>
                  <Profile />
                </CheckLogined>
              }
            />
            <Route path="/profile/:pnname" element={<PartnerProfile />} />
            <Route
              path="/login"
              element={
                <CheckAuth>
                  <Login />
                </CheckAuth>
              }
            />
            <Route path="/ConfirmEmail" element={<ConfirmEmail />} />
            <Route
              path="/payment"
              element={
                <CheckLogined>
                  <Payment />
                </CheckLogined>
              }
            />
            <Route
              path="/payment-success"
              element={
                <CheckLogined>
                  <PaymentSuccess />
                </CheckLogined>
              }
            />
            <Route
              path="/admin/*"
              element={
                <CheckPermission>
                  <Admin />
                </CheckPermission>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {user.role == "Admin" || pathname == "/welcome" ? null : <Footer />}
        <ToastContainer />
        {system?.loading == true ? <LoadingLocal /> : ""}
      </div>
    </>
  );
}

export default App;
