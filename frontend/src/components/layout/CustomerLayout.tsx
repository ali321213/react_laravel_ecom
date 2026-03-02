// frontend\src\components\layout\CustomerLayout.tsx
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
    <>
      <Navbar/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
};

export default CustomerLayout