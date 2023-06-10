import test from "ava";
import { setTimeout as delay } from 'node:timers/promises';
import searchRealEstateDotCom from "../index.js";

test.beforeEach(async (t) => {
  await delay(1000);
});

function testListingProperties(t, listing) {
  t.true(listing.hasOwnProperty("auctionDate"));
  t.true(listing.hasOwnProperty("availableDate"));
  t.true(listing.hasOwnProperty("badge"));
  t.true(listing.hasOwnProperty("bathrooms"));
  t.true(listing.hasOwnProperty("bedrooms"));
  t.true(listing.hasOwnProperty("buildingSize"));
  t.true(listing.hasOwnProperty("buildingSizeUnit"));
  t.true(listing.hasOwnProperty("description"));
  t.true(listing.hasOwnProperty("fullAddress"));
  t.true(listing.hasOwnProperty("images"));
  t.true(listing.hasOwnProperty("imagesFloorplans"));
  t.true(listing.hasOwnProperty("inspections"));
  t.true(listing.hasOwnProperty("landSize"));
  t.true(listing.hasOwnProperty("landSizeUnit"));
  t.true(listing.hasOwnProperty("listers"));
  t.true(listing.hasOwnProperty("url"));
  t.true(listing.hasOwnProperty("listingCompanyId"));
  t.true(listing.hasOwnProperty("listingCompanyName"));
  t.true(listing.hasOwnProperty("listingCompanyPhone"));
  t.true(listing.hasOwnProperty("parkingSpaces"));
  t.true(listing.hasOwnProperty("postcode"));
  t.true(listing.hasOwnProperty("price"));
  t.true(listing.hasOwnProperty("priceText"));
  t.true(listing.hasOwnProperty("propertyId"));
  t.true(listing.hasOwnProperty("propertyType"));
  t.true(listing.hasOwnProperty("shortAddress"));
  t.true(listing.hasOwnProperty("soldDate"));
  t.true(listing.hasOwnProperty("state"));
  t.true(listing.hasOwnProperty("suburb"));

  t.true(typeof listing.auctionDate === "string" || listing.auctionDate === null);
  t.true(typeof listing.availableDate === "string" || listing.availableDate === null);
  t.true(typeof listing.badge === "string" || listing.badge === null);
  t.true(typeof listing.bathrooms === "number" || listing.bathrooms === null);
  t.true(typeof listing.bedrooms === "number" || listing.bedrooms === null);
  t.true(typeof listing.buildingSize === "number" || listing.buildingSize === null);
  t.true(typeof listing.buildingSizeUnit === "string" || listing.buildingSizeUnit === null);
  t.true(typeof listing.description === "string" || listing.description === null);
  t.true(typeof listing.fullAddress === "string" || listing.fullAddress === null);
  t.true(Array.isArray(listing.images));
  t.true(Array.isArray(listing.imagesFloorplans));
  t.true(Array.isArray(listing.inspections));
  t.true(typeof listing.landSize === "number" || listing.landSize === null);
  t.true(typeof listing.landSizeUnit === "string" || listing.landSizeUnit === null);
  t.true(Array.isArray(listing.listers));
  t.true(typeof listing.url === "string" || listing.url === null);
  t.true(typeof listing.listingCompanyId === "string" || listing.listingCompanyId === null);
  t.true(typeof listing.listingCompanyName === "string" || listing.listingCompanyName === null);
  t.true(typeof listing.listingCompanyPhone === "string" || listing.listingCompanyPhone === null);
  t.true(typeof listing.parkingSpaces === "number" || listing.parkingSpaces === null);
  t.true(typeof listing.postcode === "string" || listing.postcode === null);
  t.true(typeof listing.price === "number" || listing.price === null);
  t.true(typeof listing.priceText === "string" || listing.priceText === null);
  t.true(typeof listing.propertyId === "string" || listing.propertyId === null);
  t.true(typeof listing.propertyType === "string" || listing.propertyType === null);
  t.true(typeof listing.shortAddress === "string" || listing.shortAddress === null);
  t.true(typeof listing.soldDate === "string" || listing.soldDate === null);
  t.true(typeof listing.state === "string" || listing.state === null);
  t.true(typeof listing.suburb === "string" || listing.suburb === null);

  t.is(Object.keys(listing).length, 29);
}

test.serial("searchRealEstateDotCom returns an array of listings", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 10,
  });
  t.true(Array.isArray(listings));
  t.true(listings.length === 10);
  listings.forEach(listing => testListingProperties(t, listing));
});

test.serial("searchRealEstateDotCom returns different number of results when changing limit", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 3,
  });
  t.true(Array.isArray(listings));
  t.true(listings.length === 3);
  listings.forEach(listing => testListingProperties(t, listing));
});

test.serial("searchRealEstateDotCom only returns homes within the specified location", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 10,
    locations: ["Cleveland, QLD 4163"],
    surroundingSuburbs: false,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 10);
  t.true(listings.filter(listing => listing.suburb && listing.postcode && listing.state).length === 10);
  listings.forEach(listing => testListingProperties(t, listing));
  listings.forEach(listing => t.is(listing.suburb.toLowerCase(), "cleveland"));
  listings.forEach(listing => t.is(listing.postcode, "4163"));
  listings.forEach(listing => t.is(listing.state.toLowerCase(), "qld"));
});

test.serial("searchRealEstateDotCom returns homes from within multiple specified locations", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 10,
    locations: ["Cleveland, QLD 4163", "Birkdale, QLD 4159"],
    surroundingSuburbs: false,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 10);
  t.true(listings.filter(listing => listing.suburb && listing.postcode && listing.state).length === 10);
  listings.forEach(listing => testListingProperties(t, listing));
  listings.forEach(listing => t.true(listing.suburb.toLowerCase() === "cleveland" || listing.suburb.toLowerCase() === "birkdale"));
  listings.forEach(listing => t.true(listing.postcode === "4163" || listing.postcode === "4159"));
  listings.forEach(listing => t.is(listing.state.toLowerCase(), "qld"));
});

test.serial("searchRealEstateDotCom returns homes from surrounding suburbs", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 50,
    locations: ["Nindooinbah, QLD 4285"],
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 50);
  t.true(listings.filter(listing => listing.suburb && listing.postcode && listing.state).length === 50);
  listings.forEach(listing => testListingProperties(t, listing));
  t.true(listings.some(listing => listing.suburb.toLowerCase() !== "nindooinbah"));
  t.true(listings.some(listing => listing.postcode !== "4285"));
  listings.forEach(listing => t.is(listing.state.toLowerCase(), "qld"));
});

test.serial("searchRealEstateDotCom returns homes with minBedrooms", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    minBedrooms: 3,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.bedrooms).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.bedrooms).forEach(listing => t.true(listing.bedrooms >= 3));
});

test.serial("searchRealEstateDotCom returns homes with maxBedrooms", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    maxBedrooms: 2,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.bedrooms).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.bedrooms).forEach(listing => t.true(listing.bedrooms <= 2));
});

test.serial("searchRealEstateDotCom returns homes within bedroom range", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    minBedrooms: 2,
    maxBedrooms: 4,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.bedrooms).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.bedrooms).forEach(listing => t.true(listing.bedrooms >= 2 && listing.bedrooms <= 4));
});

test.serial("searchRealEstateDotCom returns homes with minBathrooms", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    minBathrooms: 3,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.bathrooms).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.bathrooms).forEach(listing => t.true(listing.bathrooms >= 3));
});

test.serial("searchRealEstateDotCom returns homes with minCarspaces", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    minCarspaces: 3,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.parkingSpaces).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.parkingSpaces).forEach(listing => t.true(listing.parkingSpaces >= 3));
});

test.serial("searchRealEstateDotCom returns homes with minLandArea", async (t) => {
  const listings = await searchRealEstateDotCom({
    limit: 20,
    minLandArea: 400,
  });

  t.true(Array.isArray(listings));
  t.true(listings.length === 20);
  t.true(listings.filter(listing => listing.landSize).length > 0);
  listings.forEach(listing => testListingProperties(t, listing));

  listings.filter(listing => listing.landSize).forEach(listing => t.true(listing.landSize >= 400));
});
