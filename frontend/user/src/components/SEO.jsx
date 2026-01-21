import { Helmet } from "react-helmet-async";
import { useWebsiteSettings } from "../contexts/WebsiteSettingsContext";

/**
 * SEO Component with dynamic meta tags
 * @param {Object} props
 * @param {string} props.title - Page title (will append site name)
 * @param {string} props.description - Page description
 * @param {string} props.keywords - SEO keywords
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, article, product)
 */
export const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}) => {
  const { getSetting } = useWebsiteSettings();

  // Get default values from settings
  const siteName = getSetting("site_name", "Watch Store");
  const defaultDescription = getSetting(
    "meta_description",
    "Premium watch collection"
  );
  const defaultKeywords = getSetting(
    "meta_keywords",
    "watches, luxury watches"
  );
  const logoUrl = getSetting("logo_url");
  const siteUrl = window.location.origin;

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || logoUrl || `${siteUrl}/og-image.jpg`;
  const canonicalUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

/**
 * Product-specific SEO component
 */
export const ProductSEO = ({ product }) => {
  const siteName = "Watch Store";
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      <title>{`${product.name} | ${siteName}`}</title>
      <meta name="description" content={product.description} />

      {/* Open Graph Product */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description} />
      <meta property="og:image" content={product.images?.[0]?.imageUrl} />
      <meta property="og:url" content={`${siteUrl}/products/${product.id}`} />

      {/* Product specific */}
      <meta property="product:price:amount" content={product.price} />
      <meta property="product:price:currency" content="VND" />
      {product.brand && (
        <meta property="product:brand" content={product.brand.name} />
      )}

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: product.images?.map((img) => img.imageUrl) || [],
          description: product.description,
          brand: {
            "@type": "Brand",
            name: product.brand?.name || siteName,
          },
          offers: {
            "@type": "Offer",
            url: `${siteUrl}/products/${product.id}`,
            priceCurrency: "VND",
            price: product.price,
            availability:
              product.stockQuantity > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
          aggregateRating: product.averageRating
            ? {
                "@type": "AggregateRating",
                ratingValue: product.averageRating,
                reviewCount: product.reviewCount || 0,
              }
            : undefined,
        })}
      </script>
    </Helmet>
  );
};
