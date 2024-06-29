"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type userToken = {
  name: string;
  value: string;
};

export async function revalidateTag(pathName: string, componentName: string) {
  // @ts-ignore
  revalidatePath(pathName, componentName);
}

export async function userDeatils(userToken: userToken | undefined) {
  try {
    if (!userToken) {
      return redirect("/sign-in");
    }

    const response = await fetch(
      "http://localhost:3000/api/user/current-user",
      {
        method: "GET",
        headers: {
          cookie: `token=${userToken?.value}`, // Include token in cookie
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    // console.log("API response:", data);

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
  }
}