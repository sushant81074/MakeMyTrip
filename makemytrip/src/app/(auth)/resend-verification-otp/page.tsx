"use client";

import Image from "next/image";
import React, { useState } from "react";
import plane from "@/public/plane.svg";
import tajmahal from "@/public/tajmahal.png";
import lalkila from "@/public/lalkila.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { handleHTTPError } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ResendVerificationOtp = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!email) return toast.error("Email is required");

      const res = await fetch("api/user/resend-verification-otp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        handleHTTPError(res.status, data.message);
        return;
      }

      if (data.success === true) {
        toast.success(data.message);
        setLoading(false);
        return router.push("/verify");
      }
    } catch (error: any) {
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCss =
    "focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md h-12";
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
          <p className="text-xs text-neutral-400/60 font-bold">Get OTP</p>
        </div>

        <div className="w-full max-w-xs py-5 pb-14 flex flex-col items-center gap-3">
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCss}
            placeholder="your email"
          />
          <p className="text-xs text-gray-500 text-center">
            OTP has been sent to your email address
          </p>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-1"
          >
            {loading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              "Get OTP"
            )}
          </Button>
          <div className="flex justify-center items-center gap-8">
            <Separator className="w-full" />
            <span>OR</span>
            <Separator className="w-full" />
          </div>
          <div className="flex items-center py-2 justify-center gap-4">
            <Button
              type="submit"
              asChild
              className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-1"
            >
              <Link href="/sign-up">Sign-Up</Link>
            </Button>
            <Separator orientation="vertical" className="h-7" />

            <Button
              type="submit"
              asChild
              className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-1"
            >
              <Link href="/sign-in">Sign-In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationOtp;
