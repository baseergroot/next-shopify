import ProductClient from "@/components/ProductClient";
import { getProduct } from "@/lib/shopify";

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct((await params).handle);
  console.log("Product response:", product, product.priceRange);


  if (!product) {
    return <p className="p-6">❌ Product not found</p>;
  }

  return <ProductClient product={product} />;
  // return <p>Product: {product.title}</p>;
}
