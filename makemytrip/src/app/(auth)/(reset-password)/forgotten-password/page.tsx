/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleHTTPError } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [Data, setData] = useState({ email: "", username: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (Data.email === "" || Data.username === "") {
        return toast.error("Please fill all the fields");
      }

      setLoading(true);

      const res = await fetch("/api/user/forgotten-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Data.email,
          username: Data.username,
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
        router.push("/set-forgotten-password");
      }
    } catch (error: any) {
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
          Enter your Details
        </p>
      </div>

      <div className="w-full max-w-xs py-5 pb-14 flex flex-col items-center gap-3">
        <Input
          id="email"
          name="email"
          type="email"
          value={Data.email}
          onChange={(e) => setData({ ...Data, email: e.target.value })}
          className={inputCss}
          placeholder="your email"
        />
        <Input
          name="username"
          id="username"
          value={Data.username}
          onChange={(e) => setData({ ...Data, username: e.target.value })}
          className={inputCss}
          placeholder="User name"
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-2"
        >
          {loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            "Get OTP"
          )}
        </Button>
      </div>
    </div>
  );
};

export default page;
