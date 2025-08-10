import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  property?: {
    title?: string;
    price?: number;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'Texas Real Estate | Luxury Homes for Sale | Premium Properties',
  description = 'Discover luxury homes for sale in Texas. Find your dream home in Dallas, Houston, Austin, San Antonio, and across Texas. Expert real estate services with premium properties, new construction homes, and investment opportunities.',
  keywords = 'Texas real estate, homes for sale Texas, luxury homes Texas, Dallas real estate, Houston real estate, Austin real estate, San Antonio real estate, Texas properties, new construction homes Texas, investment properties Texas, real estate agent Texas, property management Texas',
  image = '/og-image.jpg',
  url = 'https://your-domain.com/',
  type = 'website',
  property
}) => {
  // Generate property-specific structured data if property is provided
  const generatePropertyStructuredData = () => {
    if (!property) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": property.title || "Luxury Home in Texas",
      "description": `Beautiful ${property.bedrooms || 0} bedroom, ${property.bathrooms || 0} bathroom home with ${property.sqft?.toLocaleString() || 0} sq ft in ${property.location || 'Texas'}`,
      "category": "Real Estate",
      "brand": {
        "@type": "Brand",
        "name": "Premium Real Estate Texas"
      },
      "offers": {
        "@type": "Offer",
        "price": property.price || 0,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "RealEstateAgent",
          "name": "Premium Real Estate Texas"
        }
      },
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.location || "Texas",
          "addressRegion": "TX",
          "addressCountry": "US"
        }
      }
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Premium Real Estate Texas" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Property-specific structured data */}
      {property && (
        <script type="application/ld+json">
          {JSON.stringify(generatePropertyStructuredData())}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 