import got from "got";
import generateGraphQLPayload from "./graphql/generateGraphQLPayload.js";
import parseListing from "./helpers/parseListing.js";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.6.01001)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
];

const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

const graphqlBaseUrl = "https://lexa.realestate.com.au/graphql";

const headers = {
  "content-type": "application/json",
  "origin": "https://www.realestate.com.au",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent": userAgent,
};

const maxSearchPageSize = 500;

const defaultOptions = {
  limit: -1,
  startPage: 1,
  channel: "buy",
  locations: [],
  surroundingSuburbs: true,
  excludeNoSalePrice: false,
  furnished: null,
  petsAllowed: null,
  excludeUnderContract: false,
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  maxBedrooms: null,
  minBathrooms: null,
  minCarspaces: null,
  minLandArea: null,
  constructionStatus: null,
  propertyTypes: [], // "house", "unit apartment", "townhouse", "villa", "land", "acreage", "retire", "unitblock"
  keywords: [],
  sortType: "relevance",
}

export async function searchRealEstateDotCom(options = {}) {
  const {
    limit,
    startPage,
    channel,
    locations,
    surroundingSuburbs,
    excludeNoSalePrice,
    furnished,
    petsAllowed,
    excludeUnderContract,
    minPrice,
    maxPrice,
    minBedrooms,
    maxBedrooms,
    minBathrooms,
    minCarspaces,
    minLandArea,
    constructionStatus,
    propertyTypes,
    keywords,
    sortType,
  } = {...defaultOptions, ...options};

  /**
   * Gets the query parameters for the GraphQL query
   */
  function formatQueryParameters(page = currentPage) {
    const pageSize = limit > maxSearchPageSize ? maxSearchPageSize : limit;

    const localities = locations.map((location) => ({"searchLocation": location}));

    const filters = {
      surroundingSuburbs,
      excludeNoSalePrice,
      "ex-under-contract": excludeUnderContract,
      ...(furnished !== null) && {furnished: true},
      ...(petsAllowed !== null) && {petsAllowed: true},

      priceRange: {
        ...(minPrice !== null) && {minPrice: Math.max(minPrice, 0)},
        ...(maxPrice !== null) && {maxPrice: Math.max(maxPrice, 0)},
      },

      bedroomsRange: {
        ...(minBedrooms !== null) && {minBedrooms: Math.max(minBedrooms, 0)},
        ...(maxBedrooms !== null) && {maxBedrooms: Math.max(maxBedrooms, 0)},
      },

      minimumBathroom: minBathrooms,
      minimumCars: minCarspaces,
      ...(minLandArea !== null) && {landSize: {
        minLandArea: Math.max(minLandArea, 0),
      }},
      constructionStatus,
      propertyTypes,
      keywords: {
        terms: keywords,
      },
    };

    return {
      channel,
      page,
      pageSize, 
      localities,
      filters,
      sort_type: sortType,
    };
  }

  function parseResults(json) {
    const data = json?.data ?? {};
    const channelSearch = data[`${channel}Search`] ?? {};
    return channelSearch?.results ?? {};
  }

  function getListingsFromResults(json) {
    const results = parseResults(json);
    const exactListings = results?.exact?.items ?? [];
    const surroundingListings = results?.surrounding?.items ?? [];
    const dataList = [...exactListings, ...surroundingListings];

    return dataList.map((data) => data.listing ?? {});
  }

  async function fetchPage(pageNumber) {
    const queryParameters = formatQueryParameters(pageNumber);
    const json = generateGraphQLPayload(channel, queryParameters);

    try {
      return await got(graphqlBaseUrl, {
        method: "POST",
        headers,
        json,
      }).json();
    } catch (error) {
      return [];
    }
  }

  function searchCompleted(listings, responseJson) {
    if (!responseJson || !getListingsFromResults(responseJson)) {
      return true;
    }

    if (limit >= 0 && listings.length >= limit) {
      return true;
    }

    const results = parseResults(responseJson);
    const moreResultsAvailable = results?.pagination?.moreResultsAvailable ?? false;

    return !moreResultsAvailable;
  }

  let currentPage = startPage;
  let listings = [];
  let responseJson;

  do {
    responseJson = await fetchPage(currentPage);
    const newListings = getListingsFromResults(responseJson);
    const newParsedListings = newListings.map(parseListing);
    listings = [...listings, ...newParsedListings];
    currentPage += 1;
  } while (!searchCompleted(listings, responseJson));

  return listings;
}
