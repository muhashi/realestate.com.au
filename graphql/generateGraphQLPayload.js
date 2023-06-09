import { searchBuyQuery } from "./searchBuyQuery.js";
import { searchRentQuery } from "./searchRentQuery.js";
import { searchSoldQuery } from "./searchSoldQuery.js";

const graphqlQueries = {
  buy: searchBuyQuery,
  rent: searchRentQuery,
  sold: searchSoldQuery,
};

export default function generateGraphQLPayload(channel, queryParametersJSON) {
  const graphQLQuery = graphqlQueries[channel] ?? searchBuyQuery;

  return {
    operationName: "searchByQuery",
    variables: {
      query: JSON.stringify(queryParametersJSON),
      testListings: false,
      nullifyOptionals: false,
      ...(channel === "rent") && {recentHides: []},
    },
    query: graphQLQuery,
  };
}
