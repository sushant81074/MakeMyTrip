import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import Order from "@/model/orders.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    if (request.method !== "PATCH") {
      throw new ApiError(405, "Invalid request method");
    }

    const tokenData: any = await tokenDecrypter(request);

    const { valid, user } = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const orderId = request.nextUrl.searchParams.get("orderId");
    const itemId = request.nextUrl.searchParams.get("itemId");

    if (!orderId || !itemId)
      throw new ApiError(
        400,
        `${!orderId ? "orderId is required, " : ""} ${
          !itemId ? "itemId is required" : ""
        }`
      );

    const order = await Order.findOne({ orderId });

    if (!order) throw new ApiError(404, "order with orderId not found");

    let itemFound = false;

    order.orders.forEach((order: any) => {
      if (order.itemId == itemId) {
        order.isCancelled = true;
        itemFound = true;
      }
    });

    if (!itemFound)
      throw new ApiError(404, "order with orderId and itemId not found");

    await order.save();

    return NextResponse.json(
      {
        message: "order canelled successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      { message: error?.message || "internal server error", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
