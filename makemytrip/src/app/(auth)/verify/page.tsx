"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  handleGenericError,
  handleHTTPError,
  handleValidationErrors,
} from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email(),
  otp: z
    .string({
      message: "Please enter a valid OTP.",
    })
    .min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
});

const VerifyPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = {
        email: formData.email,
        otp: formData.otp,
      };

      FormSchema.parse(data);

      // Reset errors if validation passes
      setErrors({});

      // Call API
      const res = await fetch(`http://localhost:3000/api/user/verify-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: parseInt(formData.otp),
        }),
      });

      const response = await res.json();

      if (!res.ok) {
        handleHTTPError(res.status, response.message);
        return;
      }

      if (response.message) {
        toast.success(response.message);
        router.push("/");
      }

      setLoading(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        handleValidationErrors(error, setErrors, setLoading);
      } else {
        handleGenericError(error, setLoading);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 pt-8">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.3] max-w-[330px] md:min-w-[540px]">
        Enter Your @ccount and OTP 😉...
      </h1>
      <div className="flex flex-col gap-5 items-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Your Email</Label>
          <Input
            disabled={loading}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md h-14"
            type="email"
            id="email"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>
        <div>
          <InputOTP
            disabled={loading}
            value={formData.otp}
            onChange={(otp) => setFormData({ ...formData, otp })}
            maxLength={6}
          >
            <InputOTPGroup className="">
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={0} />
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={1} />
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="text-gray-300" />
            <InputOTPGroup>
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={3} />
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={4} />
              <InputOTPSlot className="sm:h-20 sm:w-16 sm:text-2xl" index={5} />
            </InputOTPGroup>
          </InputOTP>
          {errors.otp && (
            <p className="text-red-500 pt-1 text-xs">{errors.otp}</p>
          )}

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-[#009EE2] hover:bg-[#009EE2]/80 mt-5"
            onClick={handleSubmit}
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
          <p className="text-sm text-gray-500 pt-3 text-center">
            OTP has been sent to your email address
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
