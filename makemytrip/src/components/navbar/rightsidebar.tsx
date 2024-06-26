import React from "react";
import { Button } from "../ui/button";

import avtar from "@/public/avtar.gif";
import burger from "@/public/burger.svg";
import Image from "next/image";
import logo from "@/public/logo.svg";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const RightSideBar = () => {
  return (
    <div className="flex gap-5 items-center">
      <ul className="flex gap-2">
        {[
          {
            name: "Support",
            class: "text-slate-500 hidden lg:block",
            variant: "ghost",
            size: "sm",
          },
          {
            name: "List Your Property",
            class: "text-slate-500 hidden md:block",
            variant: "outline",
            size: "sm",
          },
        ].map((item) => (
          <li key={item.name}>
            <Button
              size={item.size}
              variant={item.variant}
              className={`rounded-full text-sm ${item.class}`}
            >
              {item.name}
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <div>
          <Popover>
            <PopoverTrigger
              asChild
              className="rounded-full bg-transparent hover:bg-slate-100 cursor-pointer"
            >
              <Image
                src={avtar}
                alt="bell"
                className="object-cover"
                width={40}
                height={40}
              />
            </PopoverTrigger>
            <PopoverContent className="w-80 h-52">Content</PopoverContent>
          </Popover>
        </div>

        {/* Mobile sheet */}
        <div className="block sm:hidden">
          <Sheet>
            <SheetTrigger>
              <Button
                size="icon"
                className="rounded-full bg-transparent hover:bg-slate-100"
              >
                <Image src={burger} alt="bell" width={25} height={25} />
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader className="shadow-sm pb-3">
                <SheetTitle className="flex justify-start items-center gap-1">
                  <Image src={logo} alt="logo" width={35} height={35} />
                  <p>Trip</p>
                </SheetTitle>
              </SheetHeader>

              {/* content */}
              <div className="h-full flex flex-col items-start justify-between py-5">
                <ul className="pt-4 flex flex-col gap-5">
                  {[
                    "Travelers",
                    "Flights",
                    "Car rental",
                    "Things to do",
                    "Support",
                  ].map((item) => (
                    <SheetDescription
                      key={item}
                      className="text-slate-500 cursor-pointer text-xl font-semibold hover:text-primary-500"
                    >
                      {item}
                    </SheetDescription>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  className="self-center w-full mb-6 rounded-full"
                >
                  List your property
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
