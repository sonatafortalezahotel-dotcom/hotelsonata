type GoogleAdsConversionProps = {
  /** Formato: AW-XXXXXXXXX/rótulo */
  sendTo: string;
};

/**
 * Snippet de evento de conversão do Google Ads.
 * Precisa estar na página da conversão (ex.: home) — o tag global sozinho não dispara a ação.
 */
export function GoogleAdsConversion({ sendTo }: GoogleAdsConversionProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('event', 'conversion', {'send_to': '${sendTo}'});
        `,
      }}
    />
  );
}
