import Image from "next/image";
import React from "react";
import logo from "@/public/logo.svg";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <div className="px-14 bg-neutral-100">
      <div className="w-full py-12 flex items-center justify-around flex-col lg:flex-row gap-14 lg:gap-0">
        <div className="flex gap-1 items-center">
          <Image src={logo} alt="logo" width={35} height={35} />
          <span className="text-primary-500 font-bold text-lg">MakeMyTrip</span>
        </div>

        <div className="w-full max-w-md text-sm font-bold flex justify-around items-center">
          {[
            {
              title: "About",
              links: [{ title: "Project" }],
            },
            {
              title: "Project",
              links: [{ title: "Press" }],
            },
            {
              title: "Jobs",
              links: [{ title: "Download" }],
            },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <h1 className="">{item.title}</h1>
              {item.links.map((link) => (
                <p key={link.title} className="text-neutral-500">
                  {link.title}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="">
          <h1 className="">Join our community 🔥</h1>
          <div className="w-full mt-2 rounded-full flex items-center relative">
            <Input
              placeholder="Enter your email"
              className="w-full outline-none border-none focus-visible:ring-0 rounded-full"
            />
            <Button
              size={"icon"}
              variant={"outline"}
              className="text-white flex absolute right-1 top-0 items-center justify-center rounded-full px-3 py-3"
            >
              <ArrowRight className="text-black" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full px-14 flex items-center justify-center lg:justify-start text-center font-bold text-neutral-400 py-2 text-xs">
        <p>© 2021 MakeMyTrip Pvt Ltd. All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
