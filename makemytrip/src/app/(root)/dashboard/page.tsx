import { cookies } from "next/headers";

const DashboardPage = async () => {
  const userToken = cookies().get("token");

  if (!userToken) {
    return <div>Unauthorized</div>;
  }

  const response = await fetch("http://localhost:3000/api/user/current-user", {
    method: "GET",
    headers: {
      cookie: `token=${userToken?.value}`, // Include token in cookie
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  // console.log("API response:", data);

  return <div>DashboardPage: {JSON.stringify(data)} </div>;
};

export default DashboardPage;
