import mongoose from "mongoose";

interface HotelBookingInterface extends Document {
  bookingId: string;
  roomNumber: number;
  roomId: string;
  roomTypeId: string;
  hotelId: string;
  currentGuestId: string;
  roomRef: mongoose.Schema.Types.ObjectId;
  roomTypeRef: mongoose.Schema.Types.ObjectId;
  hotelRef: mongoose.Schema.Types.ObjectId;
  UserRef: mongoose.Schema.Types.ObjectId;
}

const hotelBookingSchema: mongoose.Schema<HotelBookingInterface> =
  new mongoose.Schema(
    {
      bookingId: {
        type: String,
        required: true,
      },
      roomNumber: {
        type: Number,
        required: true,
      },
      roomId: {
        type: String,
        required: true,
      },
      roomTypeId: {
        type: String,
        required: true,
      },
      hotelId: {
        type: String,
        required: true,
      },
      currentGuestId: {
        type: String,
        required: true,
      },
      roomRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      roomTypeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
        required: true,
      },
      hotelRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      UserRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );

const HotelBooking =
  mongoose.models.HotelBooking ||
  mongoose.model<HotelBookingInterface>("HotelBooking", hotelBookingSchema);

export default HotelBooking;
