import { ProductDetail } from "@/components/shop/product-detail";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
