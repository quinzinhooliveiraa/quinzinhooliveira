import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";

interface PixelConfig {
  route: string;
  facebookPixelId: string | null;
  tiktokPixelId: string | null;
  gaMeasurementId: string | null;
  gtmId: string | null;
  customHead: string | null;
  customBodyEnd: string | null;
}

const cache = new Map<string, PixelConfig | null>();

export default function PagePixels() {
  const location = useLocation();
  const [config, setConfig] = useState<PixelConfig | null>(null);
  const bodyContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const route = location.pathname;
    if (route.startsWith("/admin")) {
      setConfig(null);
      return;
    }
    if (cache.has(route)) {
      setConfig(cache.get(route) || null);
      return;
    }
    let cancelled = false;
    api
      .get<PixelConfig | null>(`/pixels?route=${encodeURIComponent(route)}`)
      .then((res) => {
        cache.set(route, res || null);
        if (!cancelled) setConfig(res || null);
      })
      .catch(() => {
        if (!cancelled) setConfig(null);
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  // Inject customBodyEnd via DOM (so inline scripts execute)
  useEffect(() => {
    const node = bodyContainer.current;
    if (!node) return;
    node.innerHTML = "";
    if (config?.customBodyEnd) {
      const tpl = document.createElement("template");
      tpl.innerHTML = config.customBodyEnd;
      Array.from(tpl.content.childNodes).forEach((child) => {
        if (child.nodeType === 1 && (child as HTMLElement).tagName === "SCRIPT") {
          const orig = child as HTMLScriptElement;
          const s = document.createElement("script");
          for (const a of Array.from(orig.attributes)) s.setAttribute(a.name, a.value);
          s.text = orig.textContent || "";
          node.appendChild(s);
        } else {
          node.appendChild(child.cloneNode(true));
        }
      });
    }
  }, [config?.customBodyEnd]);

  if (!config) return <div ref={bodyContainer} style={{ display: "none" }} />;

  const { facebookPixelId, tiktokPixelId, gaMeasurementId, gtmId, customHead } = config;

  return (
    <>
      <Helmet>
        {gtmId && (
          <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</script>
        )}
        {gaMeasurementId && (
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}></script>
        )}
        {gaMeasurementId && (
          <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}');`}</script>
        )}
        {facebookPixelId && (
          <script>{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${facebookPixelId}');fbq('track','PageView');`}</script>
        )}
        {facebookPixelId && (
          <noscript>{`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1" />`}</noscript>
        )}
        {tiktokPixelId && (
          <script>{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${tiktokPixelId}');ttq.page();}(window,document,'ttq');`}</script>
        )}
        {customHead && <script>{customHead}</script>}
      </Helmet>
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      <div ref={bodyContainer} style={{ display: "none" }} />
    </>
  );
}
