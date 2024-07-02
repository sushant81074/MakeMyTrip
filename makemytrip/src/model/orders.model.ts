import mongoose from "mongoose";

interface OrderInterface extends Document {
  bookingRef: mongoose.Schema.Types.ObjectId;
  bookingId: string;
  orderId: string;
  orders: object[];
}

const orderSchema: mongoose.Schema<OrderInterface> = new mongoose.Schema(
  {
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
    orderId: {
      type: String,
      required: true,
    },
    orders: [
      {
        item: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model<OrderInterface>("Order", orderSchema);

export default Order;
