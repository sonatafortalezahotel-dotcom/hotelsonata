import { getHomeInitialData } from "@/lib/home-data";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const initialData = await getHomeInitialData("pt");
  return <HomeClient initialData={initialData} />;
}
