import { GOOGLE_ADS_CONVERSIONS, GOOGLE_ADS_ID } from "./google-ads-config";

/**
 * Snippet oficial do Google Ads (gtag.js) no <head>.
 * A conversão de visualização da home dispara só quando o path é "/".
 */
export function GoogleAds() {
  const homeConversion = GOOGLE_ADS_CONVERSIONS.homePageView.sendTo;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            (function () {
              var path = location.pathname || '/';
              if ((path === '/' || path === '') && !window.__awHomeConversionFired) {
                window.__awHomeConversionFired = true;
                gtag('event', 'conversion', {
                  send_to: '${homeConversion}',
                  value: 1.0,
                  currency: 'BRL'
                });
              }
            })();
          `,
        }}
      />
    </>
  );
}

export { GOOGLE_ADS_ID, GOOGLE_ADS_CONVERSIONS } from "./google-ads-config";
