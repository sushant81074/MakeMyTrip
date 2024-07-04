import mongoose from "mongoose";
import { boolean } from "zod";

interface OrderInterface extends Document {
  bookingRef: mongoose.Schema.Types.ObjectId;
  bookingId: string;
  orderId: string;
  orders: object[];
}

const orderSchema: mongoose.Schema<OrderInterface> = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    bookingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HotelBooking",
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
      trim: true,
    },
    orders: [
      {
        itemId: { type: String, required: true, trim: true },
        itemRef: { type: mongoose.Schema.Types.ObjectId, required: true },
        price: { type: Number, required: true },
        isCancelled: { type: boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model<OrderInterface>("Order", orderSchema);

export default Order;
