import { GoogleAdsConversion } from "@/components/analytics/GoogleAdsConversion";
import { GOOGLE_ADS_CONVERSIONS } from "@/components/analytics/google-ads-config";
import { getHomeInitialData } from "@/lib/home-data";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const initialData = await getHomeInitialData("pt");
  return (
    <>
      <GoogleAdsConversion sendTo={GOOGLE_ADS_CONVERSIONS.homePageView.sendTo} />
      <HomeClient initialData={initialData} />
    </>
  );
}
