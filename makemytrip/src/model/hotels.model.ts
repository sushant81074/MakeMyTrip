import mongoose from "mongoose";

interface HotelInterface extends Document {
  name: string;
  hotelId: string;
  hotelEmail: string;
  hotelPassword: string;
  owner: string;
  manager: string;
  city: string;
  state: string;
  address: string;
  postalCode: number;
  landmark: string;
  terrain: string;
  hotelPhoto: string;
  totalRooms: number;
  //   totalEmptyRooms: number;
  //   totalAccquiredRooms: number;     we'll see about that in future
  hotelRating: number;
  contactNo: number;
  checkInTime: string;
  checkOutTime: string;
  staffNo: number;
  isVerified: boolean;
  isActive: boolean;
  otp: number;
}

const hotelSchema: mongoose.Schema<HotelInterface> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    hotelId: {
      type: String,
      required: true,
      trim: true,
    },
    hotelEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    hotelPassword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    manager: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
    terrain: {
      type: String,
      required: true,
      enum: [
        "HILLS",
        "BEACH-SIDE",
        "URBAN",
        "RURAL",
        "FOREST",
        "DESSERT",
        "LAKE-SIDE",
        "RIVER-SIDE",
      ],
      default: "URBAN",
    },
    hotelPhoto: {
      type: String,
      required: true,
      trim: true,
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 10,
    },
    hotelRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    contactNo: {
      type: Number,
      required: true,
    },
    checkInTime: {
      type: String,
      required: true,
      default: "10:00 AM",
    },
    checkOutTime: {
      type: String,
      required: true,
      default: "12:00 PM",
    },
    staffNo: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Hotel =
  mongoose.models.Hotel ||
  mongoose.connection.model<HotelInterface>("Hotel", hotelSchema);

export default Hotel;
