import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductsIphone from "./pages/ProductsIphone";
import ProductsSamsung from "./pages/ProductsSamsung";
import ProductsGiftCard from "./pages/ProductsGiftCard";
import ProductsAccessories from "./pages/ProductsAccessories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import ProductsLists from "./components/ProductsLists";
import Search from "./pages/Search";
import Kushtet from './pages/Kushtet';
import { CartProvider } from "./CartContext";
import AddProduct from "./AddProduct";
import SherbimetMenu from "./pages/SherbimetMenu";
import Mirembajtja from "./pages/Mirembajtja";
import PjeseTelefona from "./pages/PjeseTelefona";
import PjesePlaystation from "./pages/PjesePlaystation";
import ServisiPerkrahja from "./pages/ServisiPerkrahja";
import AsistencaMobile from "./pages/AsistencaMobile";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/AdminLayout";
import AdminUsers from "./components/AdminUsers";
import AdminProducts from "./components/AdminProducts";
import AdminStats from "./components/AdminStats";
import AdminOrders from "./components/AdminOrders";
import AdminWelcome from "./components/AdminWelcome";
import AdminRoute from "./components/AdminRoute";
import Warranty from "./pages/Warranty";
import Kyqu from "./components/Kyqu";
import Regjistrohu from "./components/Regjistrohu";
import Profile from "./pages/Profile";
import NoAccess from "./pages/NoAccess";
import AdminWarrantyPanel from "./components/AdminWarrantyPanel";

// Hook për ruajtjen e token-it në localStorage
function TokenHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/profile");
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <TokenHandler />
          <Navbar />
          <Routes>
            {/* Faqja kryesore */}
            <Route path="/" element={<Home />} />

            {/* Detaje produkti me param id */}
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Rute të tjera për kategori */}
            <Route path="/products/iphone" element={<ProductsIphone />} />
            <Route path="/products/samsung" element={<ProductsSamsung />} />
            <Route path="/products/giftcard" element={<ProductsGiftCard />} />
            <Route path="/products/accessories" element={<ProductsAccessories />} />
            <Route path="/products" element={<Products />} />

            {/* Të tjera */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/products-list" element={<ProductsLists />} />
            <Route path="/search" element={<Search />} />
            <Route path="/terms" element={<Kushtet />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/sherbimet" element={<SherbimetMenu />} />
            <Route path="/sherbimet/mirembajtja" element={<Mirembajtja />} />
            <Route path="/sherbimet/telefona" element={<PjeseTelefona />} />
            <Route path="/sherbimet/playstation" element={<PjesePlaystation />} />
            <Route path="/sherbimet/servisi" element={<ServisiPerkrahja />} />
            <Route path="/sherbimet/asistenca" element={<AsistencaMobile />} />
            <Route path="/regjistrohu" element={<Regjistrohu />} />
            <Route path="/kycu" element={<Kyqu />} />

            {/* Faqe private */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* ADMIN PANEL - nested routes FIXED */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminWelcome />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="warranty" element={<AdminWarrantyPanel />} />
            </Route>

            {/* Route për warranty vetëm për admin */}
            <Route
              path="/warranty"
              element={
                <AdminRoute>
                  <Warranty />
                </AdminRoute>
              }
            />

            {/* No access & fallback */}
            <Route path="/no-access" element={<NoAccess />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;