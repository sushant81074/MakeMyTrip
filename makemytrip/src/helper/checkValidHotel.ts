import Hotel from "@/model/hotels.model";

export async function checkValidHotel(tokenData: any) {
  try {
    if (!tokenData || !tokenData?._id) return { valid: false, hotel: null };

    const validHotel = await Hotel.findById(tokenData?._id);

    if (!validHotel) return { valid: false, user: null };

    return { valid: true, hotel: validHotel };
  } catch (error: any) {
    console.error("error occured", error);

    return { valid: false, hotel: null };
  }
}
