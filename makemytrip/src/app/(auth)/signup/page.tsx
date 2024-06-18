import Image from "next/image";
import React from "react";
import backgraoundImage from "@/public/backgraoundImage.svg";
import plane from "@/public/plane.svg";
import tajmahal from "@/public/tajmahal.png";
import google from "@/public/google.svg";
import github from "@/public/github.png";
import lalkila from "@/public/lalkila.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SignUpPage = () => {
  return (
    <div className="flex max-md:flex-col max-md:items-center border border-gray-200 justify-center rounded-xl overflow-clip">
      <div className="w-full relative">
        <Image
          src={backgraoundImage}
          className="object-cover"
          alt="bgImage"
          width={783}
          height={868}
        />
      </div>
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
        <div className="flex flex-col items-center">
          <h2 className="text-[#009EE2] font-bold text-4xl">Welcome</h2>
          <p className="text-xs text-neutral-400/60 font-bold">
            LogIn with email
          </p>
        </div>

        <div className="w-full max-w-sm pt-3 flex flex-col items-center gap-3">
          <Input
            name="email"
            className="focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md h-12"
            placeholder="your email"
          />
          <Input
            className="focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md h-12"
            name="password"
            placeholder="your password"
          />
          <p className="text-xs self-end text-neutral-400 font-bold underline cursor-pointer">
            Forgot Your Password ?
          </p>

          <Button
            size={"sm"}
            className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all"
          >
            Sign Up
          </Button>
        </div>

        <div className="flex py-4 justify-center items-center gap-8">
          <Separator className="w-full" />
          <span>OR</span>
          <Separator className="w-full" />
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={"ghost"}
              className="bg-zinc-100 hover:bg-zinc-100/50 transition-all"
              size="icon"
            >
              <Image src={google} width={20} alt="google" />
            </Button>
            <Button
              variant={"ghost"}
              className="bg-zinc-100 hover:bg-zinc-100/50 transition-all"
              size="icon"
            >
              <Image src={github} width={25} alt="google" />
            </Button>
          </div>

          <p className="text-xs">
            Don&apos;t have an account?
            <span className="font-bold pl-1">Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
