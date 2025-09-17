"use client";

import { addToCart, createCart } from "@/lib/shopify";
import { useState } from "react";

export default function ProductClient({ product }: { product: any }) {
  const [cart, setCart] = useState<any>(null);

  async function handleAddToCart() {
    let currentCart = cart;

    if (!currentCart) {
      currentCart = await createCart();
    }

    const updatedCart = await addToCart(
      currentCart.id,
      product.variants.edges[0].node.id, // ✅ will exist now
      1
    );

    setCart(updatedCart);
    alert("✅ Added to cart!");
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      {product.featuredImage && (
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className="w-full max-w-md rounded"
        />
      )}

      <p dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} className="mt-4 text-gray-700" />
      <p className="mt-2 text-lg font-semibold">
        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
      </p>

      <button
        onClick={handleAddToCart}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        🛒 Add to Cart
      </button>

      {cart && (
        <a
          href={cart.checkoutUrl}
          target="_blank"
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          💳 Checkout
        </a>
      )}
    </main>
  );
}
