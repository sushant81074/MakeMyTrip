import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: true,
  },
  discounts: [
    {
      name: { type: String, required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      applicableDates: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    },
  ],
});

export const Pricing =
  mongoose.models.Pricing || mongoose.model("Pricing", pricingSchema);

export interface RoomTypeInterface extends Document {
  name: string;
  fromRoomNumber: number;
  toRoomNumber: number;
  roomTypeId: string;
  averageRating: number;
  hotelRef: mongoose.Schema.Types.ObjectId;
  suite: string;
  maximumOccupancy: number;
  bedSize: string;
  roomArea: number;
  smokingAllowed: boolean;
  hasGallery: boolean;
  availabilityStatus: string;
  description: string;
  amenities: {
    name: string;
    description?: string;
    iconUrl?: string;
  }[];
  img: string[];
  pricing: mongoose.Schema.Types.ObjectId; // Reference to a separate Pricing schema
  minStayInNights: number;
  maxStayInNights: number;
}

const roomTypeSchema: mongoose.Schema<RoomTypeInterface> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fromRoomNumber: {
      type: Number,
      required: true,
    },
    toRoomNumber: {
      type: Number,
      required: true,
    },
    roomTypeId: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    suite: {
      type: String,
      enum: ["LUX", "ECO"],
      default: "ECO",
      required: true,
    },
    maximumOccupancy: {
      type: Number,
      default: 2,
      min: 1,
      max: 10,
    },
    bedSize: {
      type: String,
      enum: ["KING", "QUEEN", "2A"],
      default: "2A",
    },
    roomArea: {
      type: Number,
      required: true,
      min: 50,
      max: 250,
    },
    smokingAllowed: {
      type: Boolean,
      default: false,
    },
    hasGallery: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    amenities: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],
    img: [
      {
        type: String,
        required: true,
      },
    ],
    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      discounts: [
        {
          name: { type: String },
          percentage: { type: Number, min: 0, max: 100 },
          applicableDates: {
            startDate: { type: Date },
            endDate: { type: Date },
          },
        },
      ],
    },
    minStayInNights: {
      type: Number,
      default: 1,
      min: 1,
      max: 15,
    },
    maxStayInNights: {
      type: Number,
      default: 45,
      min: 1,
      max: 45,
    },
  },
  { timestamps: true }
);

const RoomType =
  mongoose.models.RoomType ||
  mongoose.connection.model<RoomTypeInterface>("RoomType", roomTypeSchema);

export default RoomType;
