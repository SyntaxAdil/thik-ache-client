import React from "react";
import Navbar from "../../components/shared/navbar/navbar";
import Footer from "../../components/shared/footer/footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
