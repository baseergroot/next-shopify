import axios from "axios";

const domain:string = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token:string = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

if (!domain || !token) {
  throw new Error("Missing Shopify credentials");
}
console.log("Shopify credentials:", domain, token);

export async function getProducts() {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const res = await axios.post(
    `https://${domain}/api/2023-07/graphql.json`,
    { query },
    { headers: { "X-Shopify-Storefront-Access-Token": token } }
  );

  return res.data.data.products.edges.map((edge: any) => edge.node);
}

export async function getProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 5) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      `https://${domain}/api/2023-07/graphql.json`,
      { query, variables: { handle } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
      }
    );

    return res.data.data.product;
  } catch (err: any) {
    console.error("Shopify API error:", err.response?.data || err.message);
    throw new Error("Failed to fetch product");
  }
}

// 🛒 Create a new cart
export async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const res = await axios.post(
    `https://${domain}/api/2023-07/graphql.json`,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
    }
  );

  return res.data.data.cartCreate.cart;
}


// ➕ Add item to cart
export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  const res = await axios.post(
    `https://${domain}/api/2023-07/graphql.json`,
    { query, variables },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
    }
  );

  return res.data.data.cartLinesAdd.cart;
}
