import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  schema: object | object[];
}

/**
 * Reusable JSON-LD schema injection component
 * 
 * Renders schema.org structured data as script tags within Helmet.
 * Accepts single schema object or array of schemas.
 */
export function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];
  
  return (
    <Helmet>
      {schemas.map((s, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
