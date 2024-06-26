import Image from "next/image";
import React from "react";
import logo from "@/public/logo.svg";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Logo = () => {
  return (
    <div className="flex gap-5">
      <div className="flex gap-1 items-center font-bold">
        <Image src={logo} alt="logo" width={35} height={35} />
        <span>Trip</span>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Separator orientation="vertical" className="h-8" />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-slate-500 rounded-full">
                Travelers
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <ul className="grid gap-3 p-4 sm:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">Content</li>
                  </ul>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Logo;
