function parseAvailability(availability) {
  if (!availability) {
      return null;
  }

  // Cut off the "Available" text from the front of the string so dates can be somewhat parsed
  return availability.replace("Available ", "");
}

function parsePriceText(priceDisplayText) {
  const regex = /.*\$([0-9\,\.]+(?:k|K|m|M)*).*/;
  const priceGroups = priceDisplayText.match(regex);
  const priceText = priceGroups && priceGroups[1] ? priceGroups[1] : null;

  if (priceText === null) {
      return null;
  }

  let price;
  if (priceText.endsWith("k") || priceText.endsWith("K")) {
      price = parseFloat(priceText.slice(0, -1).replace(",", ""));
      price *= 1000;
  } else if (priceText.endsWith("m") || priceText.endsWith("M")) {
      price = parseFloat(priceText.slice(0, -1).replace(",", ""));
      price *= 1000000;
  } else {
      price = parseFloat(priceText.replace(",", "").split(".")[0]);
  }

  return parseInt(price);
}

function parsePhone(phone) {
  if (!phone) {
      return null;
  }
  return phone.replace(/\s/g, "");
}

function getLister(lister) {
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
  const sizeToInsertIntoLink = '1144x888-format=webp';

  return {
      link: media.templatedUrl?.replace("{size}", sizeToInsertIntoLink)
  };
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

export default function parseListing(listing) {
  if (!listing || typeof listing !== "object") {
    return null;
  }

  const propertyId = listing.id;
  const badge = listing.badge?.label;
  const url = listing._links?.canonical?.href;
  const address = listing.address ?? {};
  const suburb = address.suburb;
  const state = address.state;
  const postcode = address.postcode;
  const shortAddress = address.display?.shortAddress;
  const fullAddress = address.display?.fullAddress;
  const propertyType = listing.propertyType?.id;
  const listingCompany = listing.listingCompany ?? {};
  const listingCompanyId = listingCompany.id;
  const listingCompanyName = listingCompany.name;
  const listingCompanyPhone = parsePhone(listingCompany.businessPhone);
  const features = listing.generalFeatures ?? {};
  const bedrooms = features.bedrooms?.value;
  const bathrooms = features.bathrooms?.value;
  const parkingSpaces = features.parkingSpaces?.value;
  const propertySizes = listing.propertySizes ?? {};
  const buildingSize = propertySizes.building?.displayValue;
  const buildingSizeUnit = propertySizes.building?.sizeUnit?.displayValue;
  const landSize = parseFloat((propertySizes.land?.displayValue || '').replace(/,/g, ''));
  const landSizeUnit = propertySizes.land?.sizeUnit?.displayValue;
  const priceText = listing.price?.display ?? '';
  const price = parsePriceText(priceText);
  const soldDate = listing.dateSold?.display;
  const auction = listing.auction ?? {};
  const auctionDate = auction.dateTime?.value;
  const availableDateText = listing.availableDate?.display;
  const availableDate = parseAvailability(availableDateText);
  const description = listing.description ?? '';
  const images = (listing.media?.images ?? []).map((media) => getImage(media));
  const imagesFloorplans = (listing.media?.floorplans ?? []).map((media) => getImage(media));
  const listers = (listing.listers ?? []).map((lister) => getLister(lister));
  const inspections = (listing.inspections ?? []).map((inspection) => getInspection(inspection));

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
  };
}
