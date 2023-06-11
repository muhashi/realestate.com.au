import got from "got";
import generateGraphQLPayload from "./graphql/generateGraphQLPayload.js";
import parseListing from "./helpers/parseListing.js";

/**
 * Gets the results object from the GraphQL response
 * @param {object} json - raw http response as json object
 * @param {string} channel - channel that request was made to - buy, rent, sold
 * @returns object containing listing details
 */
export function parseResults(json, channel) {
  const data = json?.data ?? {};
  const channelSearch = data[`${channel}Search`] ?? {};
  return channelSearch?.results ?? {};
}

/**
 * Extracts all listings from the GraphQL response and returns them as an array
 * @param {object} json - raw http response as json
 * @param {string} channel - channel that request was made to - buy, rent, sold
 * @returns list of all listing objects
 */
export function getListingsFromResults(json, channel) {
  const results = parseResults(json, channel);
  const exactListings = results?.exact?.items ?? [];
  const surroundingListings = results?.surrounding?.items ?? [];
  const dataList = [...exactListings, ...surroundingListings];

  return dataList.map((data) => (data ?? {}).listing ?? {});
}

/**
 * Determines whether the search should be stopped based on the accrued listings and the latest API response
 * @param {object[]} listings - list of all listing objects found so far
 * @param {object} responseJson - raw http response as json
 * @param {string} channel - channel that request was made to - buy, rent, sold
 * @param {int} limit - maximum number of listings to return
 * @returns - true if search should be stopped, false otherwise
 */
function searchCompleted(listings, responseJson, channel, limit) {

  if (!responseJson || !getListingsFromResults(responseJson, channel)) {
    return true;
  }

  if (limit >= 0 && listings.length >= limit) {
    return true;
  }

  const results = parseResults(responseJson, channel);
  const moreResultsAvailable = results?.pagination?.moreResultsAvailable ?? false;

  return !moreResultsAvailable;
}

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
  channel: "buy", // "buy", "rent", "sold"
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
  minLandArea: null, // in square meters
  constructionStatus: null, // "ESTABLISHED", "NEW"
  propertyTypes: [], // "house", "unit apartment", "townhouse", "villa", "land", "acreage", "retire", "unitblock", "project-estate"
  keywords: [],
  sortType: "relevance", // "relevance", "price-desc", "price-asc", "new-desc", "new-asc", "next-inspection-time", "next-auction-time"
}

/**
 * Searches realestate.com.au for listings based on the provided options
 * @param {object} options - see the README or the defaultOptions object for all available options
 * @returns {Promise<object[]>}
 */
export default async function searchRealEstateDotCom(options = {}) {
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
   * @param {int} page - page number to get results for
   * @returns {object} - query parameters
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
        ...(minPrice !== null) && {minimum: Math.max(minPrice, 0).toString()},
        ...(maxPrice !== null) && {maximum: Math.max(maxPrice, 0).toString()},
      },

      bedroomsRange: {
        ...(minBedrooms !== null) && {minimum: Math.max(minBedrooms, 0).toString()},
        ...(maxBedrooms !== null) && {maximum: Math.max(maxBedrooms, 0).toString()},
      },

      minimumBathroom: minBathrooms,
      minimumCars: minCarspaces,
      ...(minLandArea !== null) && {landSize: {
        minimum: Math.max(minLandArea, 0).toString(),
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
      sortType,
    };
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

  let currentPage = startPage;
  let listings = [];
  let responseJson;

  do {
    responseJson = await fetchPage(currentPage);
    const newListings = getListingsFromResults(responseJson, channel);
    const newParsedListings = newListings.map(parseListing);
    listings = [...listings, ...newParsedListings];
    currentPage += 1;
  } while (!searchCompleted(listings, responseJson, channel, limit));

  return listings;
}
