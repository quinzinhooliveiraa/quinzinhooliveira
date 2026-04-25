import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://quinzinhooliveira.com.br";
const SITE_NAME = "Quinzinho Oliveira";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

type SEOProps = {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "profile" | "book";
  canonicalPath?: string;
  noIndex?: boolean;
  publishedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function absoluteUrl(path?: string) {
  if (!path) return DEFAULT_OG;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function SEO({
  title,
  description,
  image,
  type = "website",
  canonicalPath,
  noIndex = false,
  publishedTime,
  author,
  jsonLd,
}: SEOProps) {
  const location = useLocation();
  const path = canonicalPath ?? location.pathname;
  const url = `${SITE_URL}${path}`;
  const ogImage = absoluteUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
