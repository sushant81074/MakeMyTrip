"use client";

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
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const validateSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  contactNo: z.string().min(10),
});
const AuthForm = ({ type }: { type: "login" | "signup" }) => {
  const router = useRouter();
  const inputCss = `focus-visible:ring-[#009EE2]/50 outline-none border-none bg-neutral-100 w-full p-3 rounded-md ${
    type === "login" ? "h-12" : "h-10"
  }`;
  const [signUpData, setSignUpData] = useState({
    email: "",
    username: "",
    password: "",
    contactNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        email: signUpData.email,
        password: signUpData.password,
        username: signUpData.username,
        contactNo: signUpData.contactNo,
      };

      validateSchema.parse(data);

      // Reset errors if validation passes
      setErrors({});

      // Call API
      if (type === "signup") {
        const res = await fetch("http://localhost:3000/api/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Handle response
        const response = await res.json();

        console.log("Response:", response);
        

        if (!res.ok) {
          // handleHTTPError(res.status, response.message);
          return;
        }

        if (response.message) {
          toast.message(response.message);
          router.push("/verify");
          // console.log("Response:", response);
        }
        setLoading(false);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        handleGenericError(error, setLoading);
      } else {
        handleValidationErrors(error, setErrors, setLoading);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm pt-3 flex flex-col items-center gap-3">
      <Input
        name="email"
        value={signUpData?.email}
        onChange={(e) =>
          setSignUpData({ ...signUpData, email: e.target.value })
        }
        className={inputCss}
        placeholder="your email"
      />
      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

      <Input
        name="password"
        value={signUpData?.password}
        onChange={(e) =>
          setSignUpData({ ...signUpData, password: e.target.value })
        }
        className={inputCss}
        placeholder="your password"
      />
      {errors.password && (
        <p className="text-red-500 text-xs">{errors.password}</p>
      )}
      {type === "signup" && (
        <>
          <Input
            name="username"
            value={signUpData?.username}
            onChange={(e) =>
              setSignUpData({ ...signUpData, username: e.target.value })
            }
            className={inputCss}
            placeholder="your username"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}

          <Input
            name="contactNo"
            value={signUpData?.contactNo}
            onChange={(e) =>
              setSignUpData({ ...signUpData, contactNo: e.target.value })
            }
            className={inputCss}
            placeholder="your contact No"
          />
          {errors.contactNo && (
            <p className="text-red-500 text-xs">{errors.contactNo}</p>
          )}
        </>
      )}

      <p className="text-xs self-end text-neutral-400 font-bold underline cursor-pointer">
        Forgot Your Password ?
      </p>

      <Button
        type="submit"
        disabled={loading}
        onClick={handleSubmit}
        size={"sm"}
        className="bg-[#009EE2] text-white font-bold w-[7rem] hover:bg-[#009EE2]/90 transition-all mt-2"
      >
        {type === "signup" ? (
          loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            "Sign-Up"
          )
        ) : (
          "Log In"
        )}
      </Button>
    </div>
  );
};

export default AuthForm;
