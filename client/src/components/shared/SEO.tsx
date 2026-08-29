import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface SEOProps {
  title: string;
  description: string;
}

/** Thin wrapper so pages can set meta declaratively: <SEO title=... description=... />. */
export function SEO({ title, description }: SEOProps) {
  useDocumentMeta({ title: `${title} | CargoFlow`, description });
  return null;
}
