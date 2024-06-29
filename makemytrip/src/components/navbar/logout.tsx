"use client";

import React from "react";
import { Button } from "../ui/button";
import { SignOut, userToken } from "@/actions/user.actions";

const Logout = ({ userToken }: userToken) => {
  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      className="w-full focus-visible ring-0"
      onClick={async () => await SignOut(userToken)}
    >
      Log-out
    </Button>
  );
};

export default Logout;
