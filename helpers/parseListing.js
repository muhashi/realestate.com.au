function parseAvailability(availability) {
  if (!availability || typeof availability !== "string") {
      return null;
  }

  // Cut off the "Available" text from the front of the string so dates can be somewhat parsed
  return availability.replace("Available ", "");
}

function parsePriceText(priceDisplayText) {
  if (!priceDisplayText || typeof priceDisplayText !== "string") {
      return null;
  }

  priceDisplayText = priceDisplayText.toLowerCase();

  const regex = /.*\$([0-9\,\.]+(?:k|m)*).*/;
  const priceGroups = priceDisplayText.match(regex);
  const priceText = priceGroups && priceGroups[1] ? priceGroups[1] : null;

  if (priceText === null) {
      return null;
  }

  let price;
  if (priceText.endsWith("k")) {
      price = parseFloat(priceText.slice(0, -1).replace(",", ""));
      price *= 1000;
  } else if (priceText.endsWith("m")) {
      price = parseFloat(priceText.slice(0, -1).replace(",", ""));
      price *= 1000000;
  } else {
      price = parseFloat(priceText.replace(",", "").split(".")[0]);
  }

  return parseInt(price);
}

function parsePhone(phone) {
  if (!phone || typeof phone !== "string") {
      return null;
  }
  return phone.replace(/\s/g, "");
}

function getLister(lister) {
  if (!lister || typeof lister !== "object") {
    return null;
  }

  const listerId = lister.id;
  const name = lister.name;
  const agentId = lister.agentId;
  const jobTitle = lister.jobTitle;
  const url = lister._links?.canonical?.href;
  const phone = parsePhone(lister.preferredPhoneNumber);

  return {
      id: listerId,
      name,
      agentId,
      jobTitle,
      url,
      phone,
  };
}

function getImage(media) {
  if (!media || typeof media !== "object") {
      return null;
  }

  const sizeToInsertIntoLink = '1144x888-format=webp';
  return media.templatedUrl?.replace("{size}", sizeToInsertIntoLink);
}

function getInspection(inspection) {
  if (!inspection || typeof inspection !== "object") {
      return null;
  }

  const startTime = inspection.startTime;
  const endTime = inspection.endTime;
  const label = inspection.display?.longLabel;
  const labelShort = inspection.display?.shortLabel;

  return {
      startTime,
      endTime,
      label,
      labelShort
  };
}

function hectaresToMetresSquared(hectares) {
  return hectares * 10000;
}

function parseLandSize(landSizeText, landSizeUnit) {
  let landSize = typeof landSizeText === "string" ? parseFloat(landSizeText.replace(/,/g, '')) : null;

  if (landSizeUnit === "ha" && typeof landSize === "number") {
    landSize = hectaresToMetresSquared(landSize);
    landSizeUnit = "m²";
  }

  return [
    landSize,
    landSizeUnit
  ];
}

export default function parseListing(listing) {
  if (!listing || typeof listing !== "object") {
    return null;
  }
  console.log(listing);

  const propertyId = listing.id ?? null;
  const badge = listing.badge?.label ?? null;
  const url = listing._links?.canonical?.href ?? null;
  const address = listing.address ?? {};
  const suburb = address.suburb ?? null;
  const state = address.state ?? null;
  const postcode = address.postcode ?? null;
  const shortAddress = address.display?.shortAddress ?? null;
  const fullAddress = address.display?.fullAddress ?? null;
  const propertyType = listing.propertyType?.id ?? null;
  const listingCompany = listing.listingCompany ?? {};
  const listingCompanyId = listingCompany.id ?? null;
  const listingCompanyName = listingCompany.name ?? null;
  const listingCompanyPhone = parsePhone(listingCompany.businessPhone);
  const features = listing.generalFeatures ?? {};
  const bedrooms = features.bedrooms?.value ?? null;
  const bathrooms = features.bathrooms?.value ?? null;
  const parkingSpaces = features.parkingSpaces?.value ?? null;
  const propertySizes = listing.propertySizes ?? {};
  const buildingSizeText = propertySizes.building?.displayValue ?? null;
  const buildingSize = typeof buildingSizeText === "string" ? parseFloat(buildingSizeText.replace(/,/g, "")) : null;
  const buildingSizeUnit = propertySizes.building?.sizeUnit?.displayValue ?? null;
  let landSizeUnit = propertySizes.land?.sizeUnit?.displayValue ?? null;
  const landSizeText = propertySizes.land?.displayValue ?? null;
  let landSize;
  [landSize, landSizeUnit] = parseLandSize(landSizeText, landSizeUnit);
  const bondText = listing.bond?.display ?? null;
  const bond = parsePriceText(bondText);

  const priceText = listing.price?.display ?? null;
  const price = parsePriceText(priceText);
  const soldDate = listing.dateSold?.display ?? null;
  const auction = listing.auction ?? {};
  const auctionDate = auction.dateTime?.value ?? null;
  const availableDateText = listing.availableDate?.display ?? null;
  const availableDate = parseAvailability(availableDateText);
  const description = listing.description ?? null;
  const images = (listing.media?.images ?? []).map((media) => getImage(media)).filter((image) => image !== null);
  const imagesFloorplans = (listing.media?.floorplans ?? []).map((media) => getImage(media)).filter((image) => image !== null);
  const listers = (listing.listers ?? []).map((lister) => getLister(lister)).filter((lister) => lister !== null);
  const inspections = (listing.inspections ?? []).map((inspection) => getInspection(inspection)).filter((inspection) => inspection !== null);

  return {
      propertyId,
      badge,
      url,
      suburb,
      state,
      postcode,
      shortAddress,
      fullAddress,
      propertyType,
      listingCompanyId,
      listingCompanyName,
      listingCompanyPhone,
      bedrooms,
      bathrooms,
      parkingSpaces,
      buildingSize,
      buildingSizeUnit,
      landSize,
      landSizeUnit,
      price,
      priceText,
      auctionDate,
      availableDate,
      soldDate,
      description,
      images,
      imagesFloorplans,
      listers,
      inspections,
      bondText,
      bond,
  };
}
