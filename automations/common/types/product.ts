export type GroceryProduct = {
  id: string;
  label: string;
  category?: string;
  countdownQuery: string;
  newWorldQuery: string;
};

export type WoolworthsProduct = {
  id: string;
  label: string;
  category: string;
  woolworthsQuery: string;
  woolworthsMatchText?: string;
};
