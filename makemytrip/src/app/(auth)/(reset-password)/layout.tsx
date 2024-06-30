import Image from "next/image";
import React from "react";
import plane from "@/public/plane.svg";
import tajmahal from "@/public/tajmahal.png";
import lalkila from "@/public/lalkila.png";

const ForgottenPasswordLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full max-w-lg flex max-md:flex-col max-md:items-center border border-gray-200 justify-center rounded-xl overflow-clip">
      <div className="w-full flex flex-col overflow-clip items-center py-16 relative">
        <Image
          src={plane}
          alt="Plane"
          width={184}
          height={47}
          className="absolute right-0 top-5"
        />
        <Image
          src={lalkila}
          alt="Plane"
          width={164}
          height={47}
          className="absolute -right-2 bottom-0"
        />
        <Image
          src={tajmahal}
          alt="Plane"
          width={164}
          height={47}
          className="absolute -left-3 bottom-0"
        />
        {children}
      </div>
    </div>
  );
};

export default ForgottenPasswordLayout;
