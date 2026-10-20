import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CartDrawer from "./components/CartDrawer";
import { useCartDrawerStore } from "./store/useCartDrawerStore";

import Home from "./pages/Home";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  // While the cart drawer is open it occupies the top-right corner, so move
  // toasts to top-center for that window to avoid overlapping the drawer's
  // close button/header (both anchor top-right by default).
  const drawerOpen = useCartDrawerStore((s) => s.isOpen);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Toaster
        position={drawerOpen ? "top-center" : "top-right"}
        toastOptions={{
          duration: 2800,
          style: {
            background: "#0d2137",
            color: "#fefcfd",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#c9972c", secondary: "#0d2137" } },
        }}
      />
      <Header />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
