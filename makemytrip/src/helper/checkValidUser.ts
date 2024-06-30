import User from "@/model/user.model";

export async function checkValidUser(tokenData: any) {
  if (!tokenData || !tokenData._id) return false;

  try {
    const validUser = await User.findById(tokenData._id);

    if (!validUser) return { valid: false, user: null };

    return { valid: true, user: validUser };
  } catch (error) {
    console.error("Error finding user:", error);
    return { valid: false, user: null };
  }
}
