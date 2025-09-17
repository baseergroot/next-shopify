import { getProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-6 grid grid-cols-2 gap-6">
      {products.map((product: any) => (
        <div key={product.id} className="border p-4 rounded">
          <Link href={`/products/${product.handle}`}>
            <img
              src={product.featuredImage?.url}
              alt={product.featuredImage?.altText || product.title}
              className="w-full h-48 object-cover"
            />
            <h2 className="mt-2 text-xl font-bold">{product.title}</h2>
          </Link>
          <p>
            {product.priceRange.minVariantPrice.amount}{" "}
            {product.priceRange.minVariantPrice.currencyCode}
          </p>
        </div>
      ))}
    </main>
  );
}
