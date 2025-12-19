export type ComparisonResult = {
  product: string;
  woolworths: number;
  newWorld: number;
  cheapest: "Woolworths" | "New World" | "Same";
};

export function comparePrices(
  productLabel: string,
  woolworthsPrice: number,
  newWorldPrice: number
): ComparisonResult {
  let cheapest: "Woolworths" | "New World" | "Same";

  if (woolworthsPrice < newWorldPrice) {
    cheapest = "Woolworths";
  } else if (newWorldPrice < woolworthsPrice) {
    cheapest = "New World";
  } else {
    cheapest = "Same";
  }

  return {
    product: productLabel,
    woolworths: woolworthsPrice,
    newWorld: newWorldPrice,
    cheapest,
  };
}
