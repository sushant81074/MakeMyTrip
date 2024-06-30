import mongoose from "mongoose";

// the logic behind this is first you will create a room type then assign that type to these rooms with additional fields

interface RoomInterface extends Document {
  roomNumber: number;
  roomId: string;
  roomType: mongoose.Schema.Types.ObjectId;
  hotelRef: mongoose.Schema.Types.ObjectId;
  currentlyAssignedGuest: mongoose.Schema.Types.ObjectId;
  assignedFromDate: Date;
  assignedToDate: Date;
  currentAvailabilityStatus: string;
  availabilitydates: {
    available: {
      startDate: Date;
      endDate: Date;
    }[];
    unavailable: {
      startDate: Date;
      endDate: Date;
    }[];
  };
}

const roomSchema: mongoose.Schema<RoomInterface> = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    currentlyAssignedGuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedFromDate: {
      type: Date,
    },
    assignedToDate: {
      type: Date,
    },
    currentAvailabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "NOT_AVAILABLE"],
      default: "AVAILABLE",
    },
    availabilitydates: {
      available: [
        {
          startDate: { type: Date, default: () => new Date() },
          endDate: { type: Date, default: () => new Date() },
        },
      ],
      unavailable: [
        {
          startDate: { type: Date, default: () => new Date() },
          endDate: { type: Date, default: () => new Date() },
          guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    },
  },
  { timestamps: true }
);

const Room =
  mongoose.models.Room ||
  mongoose.connection.model<RoomInterface>("Room", roomSchema);

export default Room;
