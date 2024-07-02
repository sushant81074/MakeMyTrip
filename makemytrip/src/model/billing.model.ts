import mongoose from "mongoose";

interface BillingInterface extends Document {
  // room totals
  stayDaysCount: number;
  roomPrice: number;
  roomId: string;
  roomRef: mongoose.Schema.Types.ObjectId;
  // orders totals
  ordersPriceTotal: number;
  orderId: string;
  orderRef: mongoose.Schema.Types.ObjectId;
  //   hotelBooking
  bookingId: string;
  bookingRef: mongoose.Schema.Types.ObjectId;
}

const billingSchema: mongoose.Schema<BillingInterface> = new mongoose.Schema(
  {
    stayDaysCount: {
      type: Number,
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      trim: true,
    },
    roomRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ordersPriceTotal: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
      trim: true,
    },
    bookingRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Bill =
  mongoose.models.Bill ||
  mongoose.model<BillingInterface>("Bill", billingSchema);

export default Bill;
