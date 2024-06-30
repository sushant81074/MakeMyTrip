"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { handleHTTPError } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SetPasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState({
    email: "",
    username: "",
    newpassword: "",
    otp: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        Data.email === "" ||
        Data.username === "" ||
        Data.newpassword === ""
      ) {
        return toast.error("Please fill all the fields");
      }

      const res = await fetch("/api/user/set-forgotten-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Data.email,
          username: Data.username,
          newPassword: Data.newpassword,
          otp: parseInt(Data.otp),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        handleHTTPError(res.status, data.message);
        return;
      }

      if (data.success === true) {
        toast.success(data.message);
        setLoading(false);
        router.push("/sign-in");
      }
    } catch (error: any) {
      setLoading(false);
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCss =
    "focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md h-10";
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center">
        <h2 className="text-[#009EE2] font-bold text-4xl">Welcome</h2>
        <p className="text-xs text-neutral-400/60 font-bold">
          Update your Details
        </p>
      </div>
      <div className="w-full max-w-sm px-2 sm:px-0 py-5 pb-14 flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <Input
            name="email"
            disabled={loading}
            value={Data.email}
            onChange={(e) => setData({ ...Data, email: e.target.value })}
            type="email"
            className={inputCss}
            placeholder="your email"
          />
          <Input
            name="username"
            disabled={loading}
            value={Data.username}
            onChange={(e) => setData({ ...Data, username: e.target.value })}
            className={inputCss}
            placeholder="User Name"
          />
        </div>
        <Input
          name="newpassword"
          disabled={loading}
          value={Data.newpassword}
          onChange={(e) => setData({ ...Data, newpassword: e.target.value })}
          className={inputCss}
          placeholder="New password"
        />

        <InputOTP
          disabled={loading}
          value={Data.otp}
          onChange={(otp) => setData({ ...Data, otp })}
          maxLength={6}
        >
          <InputOTPGroup className="">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator className="text-gray-300" />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-sm text-gray-500 pt-3 text-center">
          OTP has been already sent to your email address
        </p>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="submit"
          className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-2"
        >
          {loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetPasswordPage;
