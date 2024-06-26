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
import { userDeatils } from "@/actions/user.actions";
import { cookies } from "next/headers";
import Link from "next/link";
import { JoinAt } from "@/lib/utils";
import { Calendar, Contact, PhoneCall, User } from "lucide-react";
import { Separator } from "../ui/separator";
import Logout from "./logout";

const RightSideBar = async () => {
  const userToken = cookies().get("token");

  const data = await userDeatils(userToken);

  if (!data) {
    return;
  }

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
              // @ts-ignore
              size={item.size}
              // @ts-ignore
              variant={item.variant}
              className={`rounded-full text-sm ${item.class}`}
            >
              {item.name}
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {userToken ? (
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
              <PopoverContent className="w-72 py-1.5">
                <div>
                  <p className="flex gap-1 items-center">
                    <User className="w-4 h-4" />
                    {data.user.username}
                  </p>
                  <p className="text-xs">{data.user.email}</p>

                  <div className="w-full flex flex-col my-2">
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="w-full focus-visible:ring-0"
                    >
                      Account Settings
                    </Button>

                    <Logout userToken={userToken} />
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 text-xs justify-between items-center">
                      {[
                        {
                          value: "Join At",
                          icon: (
                            <span className="pl-1 flex gap-1 items-center">
                              <Calendar className="w-3 h-3" />
                              {JoinAt(data.user.createdAt)}
                            </span>
                          ),
                        },
                        {
                          value: "Contact No.",
                          icon: (
                            <span className="pl-1 flex gap-1 items-center">
                              <PhoneCall className="w-4 h-4" />
                              {data.user.contactNo}
                            </span>
                          ),
                        },
                        {
                          value: "Role",
                          icon: (
                            <span className="p-1 bg-green-400 text-white text-xs rounded-full flex gap-1 items-center">
                              {data.user.role}
                            </span>
                          ),
                        },
                      ].map((item) => (
                        <div
                          key={item.value}
                          className="w-full flex text-xs justify-between items-center"
                        >
                          <p>{item.value} :</p> {item.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            asChild
            size={"sm"}
            variant={"outline"}
            className="rounded-full text-slate-500"
          >
            <Link href="/sign-in">Sign-In</Link>
          </Button>
        )}

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
