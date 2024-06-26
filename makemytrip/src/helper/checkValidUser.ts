import User from "@/model/user.model";

export async function checkValidUser(tokenData: any) {
  if (!tokenData || !tokenData?._id) return false;

  const validUser = await User.findById(tokenData?._id);

  if (!validUser) return false;

  return true;
}
