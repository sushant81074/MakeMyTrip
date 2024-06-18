import mongoose, { Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  email: string;
  role: string;
  password: string;
  contactNo: number;
  isVerified: boolean;
  isActive: boolean;
}

const userSchema: mongoose.Schema<UserInterface> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      match: [/.+\@.+\..+/, "please insert a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    contactNo: {
      type: Number,
      required: [true, "contact no. is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;
