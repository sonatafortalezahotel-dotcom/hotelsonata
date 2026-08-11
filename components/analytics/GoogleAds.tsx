export const GOOGLE_ADS_ID = "AW-11258285844";

/**
 * Snippet oficial do Google Ads (gtag.js).
 * Deve ser renderizado dentro de <head> no layout raiz
 * para o verificador do Google detectar no HTML inicial.
 */
export function GoogleAds() {
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
          `,
        }}
      />
    </>
  );
}
