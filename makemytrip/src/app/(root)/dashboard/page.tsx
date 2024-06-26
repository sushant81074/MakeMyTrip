import { userDeatils } from "@/actions/user.actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const userToken = cookies().get("token");
  // console.log(userToken);

  if (!userToken) {
    return redirect("/sign-in");
  }

  const data = await userDeatils(userToken);

  return <div>DashboardPage: {JSON.stringify(data)} </div>;
};

export default DashboardPage;
