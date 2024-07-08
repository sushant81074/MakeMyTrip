import mongoose, { Document } from "mongoose";

interface RequestBookingInterface extends Document {
  reqBookingId: string;
  hotelEmail: string;
  hotelId: string;
  roomTypeId: string;
  fromDate: Date;
  toDate: Date;
  isCancelledByUser: boolean;
  isRejectedByHotel: boolean;
  isApprovedByHotel: boolean;
}

const requestBookingSchema: mongoose.Schema<RequestBookingInterface> =
  new mongoose.Schema(
    {
      reqBookingId: {
        type: String,
        required: true,
      },
      hotelEmail: {
        type: String,
        required: true,
      },
      hotelId: {
        type: String,
        required: true,
      },
      roomTypeId: {
        type: String,
        required: true,
      },
      fromDate: {
        type: Date,
        required: true,
      },
      toDate: {
        type: Date,
        required: true,
      },
      isCancelledByUser: {
        type: Boolean,
        default: false,
      },
      isRejectedByHotel: {
        type: Boolean,
        default: false,
      },
      isApprovedByHotel: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

const RequestBooking =
  mongoose.models.RequestBooking ||
  mongoose.model<RequestBookingInterface>(
    "RequestBooking",
    requestBookingSchema
  );

export default RequestBooking;
