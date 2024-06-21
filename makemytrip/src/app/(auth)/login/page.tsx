import AuthForm from "@/components/shared/authform";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import plane from "@/public/plane.svg";
import tajmahal from "@/public/tajmahal.png";
import lalkila from "@/public/lalkila.png";
import github from "@/public/github.png";
import google from "@/public/google.svg";

const LogInPage = () => {
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

        <div className="flex flex-col items-center">
          <h2 className="text-[#009EE2] font-bold text-4xl">Welcome</h2>
          <p className="text-xs text-neutral-400/60 font-bold">
            LogIn with email
          </p>
        </div>

        {/* AuthForm */}
        <AuthForm type="login" />

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

          <p className="text-xs z-20">
            Don&apos;t have an account?
            <span className="font-bold pl-1">Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
