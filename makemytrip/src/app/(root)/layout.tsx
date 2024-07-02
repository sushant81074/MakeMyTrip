import Footer from "@/components/navbar/footer";
import Navbar from "@/components/navbar/navbar";
import Places from "@/components/shared/places";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Navbar />
      <div className="py-3 px-6 h-full">
        <Places />
      </div>

      {children}
      <Footer />
    </div>
  );
};

export default RootLayout;
