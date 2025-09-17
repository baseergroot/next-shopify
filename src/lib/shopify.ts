import axios from "axios";

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

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
        handle
        descriptionHtml
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
  `;

  const res = await axios.post(
    `https://${domain}/api/2023-07/graphql.json`,
    { query, variables: { handle } },
    { headers: { "X-Shopify-Storefront-Access-Token": token } }
  );

  return res.data.data.product; // ✅ directly the product
}


export async function createCart() {
  const mutation = `
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
    { query: mutation },
    { headers: { "X-Shopify-Storefront-Access-Token": token } }
  );

  return res.data.data.cartCreate.cart;
}


export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 5) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await axios.post(
    `https://${domain}/api/2023-07/graphql.json`,
    {
      query: mutation,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
    { headers: { "X-Shopify-Storefront-Access-Token": token } }
  );

  return res.data.data.cartLinesAdd.cart;
}