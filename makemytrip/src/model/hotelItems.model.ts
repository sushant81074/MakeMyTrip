import mongoose from "mongoose";

interface HotelItemsInterface extends Document {}

const hotelItemsSchema: mongoose.Schema<HotelItemsInterface> =
  new mongoose.Schema({});

const HotelItems =
  mongoose.models.HotelItems ||
  mongoose.model<HotelItemsInterface>("HotelItems", hotelItemsSchema);

export default HotelItems;
