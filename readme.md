# realestate.com.au api

[Install](#install) •	[Usage](#usage) •	[API](#api) •	[API Response](#api-response) •	[Acknowledgement](#acknowledgement)

> Gets real estate data from the realestate.com.au api for homes that are for sale, for rent or already sold

## Install

```sh
npm install realestate.com.au
```

## Usage

```js
import searchRealEstateDotCom from "realestate.com.au";

await searchRealEstateDotCom({limit: 10, maxPrice: 700000, locations: ["Brisbane CBD, QLD 4000"]});
/* =>[
  {
    auctionDate: "2023-06-17T13:00:00+10:00",
    availableDate: "now",
    badge: "Listed 3 hours ago",
    bathrooms: 2,
    bedrooms: 4,
    buildingSize: 1049,
    buildingSizeUnit: 'm²',
    description: 'Set in the heart of Brisbane CBD, this immaculately presented property is...',
    fullAddress: '17 Jimmy Road, Brisbane CBD, QLD 4000',
    images: [
      'https://i2.au.reastatic.net/1144x888-format=webp/f68443d9727d79775ab3e961894815f5bbc3202ce2ee3d6fe2d356b9ca/image.jpg',
      ...
  ],
    imagesFloorplans: [
      'https://i2.au.reastatic.net/1144x888-format=webp/8d532077e8fdf1d4f3c142240a7e6b7613770356a29f5905cb6e1fdaf7c/image.jpg',
      ...
    ],
    inspections: [
      {
        endTime: '2023-06-11T13:15:00+08:00',
        label: 'Open Sun 11 Jun 12:45 pm',
        labelShort: 'Open Sun 11 Jun',
        startTime: '2023-06-11T12:45:00+08:00',
      },
      ...
    ],
    landSize: 450,
    landSizeUnit: 'm²',
    listers: [
      {
        agentId: null,
        id: '2527777',
        jobTitle: null,
        name: 'Jimmy John',
        phone: '0403333333',
        url: 'https://www.realestate.com.au/agent/jimmy-john-2527777?cid={cid}',
      },
      ...
    ],
    listingCompanyId: 'FCYAAJ',
    listingCompanyName: 'COOL Property Group - WILSON',
    listingCompanyPhone: '0892598900',
    parkingSpaces: 2,
    postcode: '4000',
    price: 629000,
    priceText: 'OFFERS FROM $629,000',
    propertyId: '142231555',
    propertyType: 'house',
    shortAddress: '17 Jimmy Road',
    soldDate: null,
    state: 'QLD',
    suburb: 'Brisbane CBD',
    url: 'https://www.realestate.com.au/property-house-qld-brisbane-cbd-142231566',
    bondText: "$3,316 Bond",
    bond: 3316,
  }
]
*/
```

## API

### searchRealEstateDotCom(options?)

#### options

Type: `object`

##### limit

Type: `int`\
Default: `20`

Number of listings to return. `-1` continues to search until all properties are exhausted

##### channel

Type: `string`\
Default: `"buy"`

Which type of listings to search for. Possible options are:

- `"buy"`: Properties that are for sale
- `"rent"`: Properties that are for rent
- `"sold"`: Properties that have already been sold

##### locations

Type: `string[]`\
Default: `[]`

List of locations to search in, in this format: `["Brisbane CBD, QLD 4000"]`. An empty array includes all locations in the search.

##### minPrice and maxPrice

Type: `int`\
Default: `null`

The minimum and maximum price of listings to search for.

> Note: realestate.com.au's api doesn't always abide by these filters, so there will be a couple properties outside these filters.

##### minBedrooms and maxBedrooms

Type: `int`\
Default: `null`

The minimum and maximum number of bedrooms in properties to search for.

##### minCarspaces

Type: `int`\
Default: `null`

The minimum number of parking spaces in properties to search for.

##### minLandArea

Type: `int`\
Default: `null`

The minimum area of land of properties to search for, in square meters.

##### constructionStatus

Type: `string`\
Default: `null`

The construction status of the property, either `"NEW"` or `"ESTABLISHED"`.

##### propertyTypes

Type: `string[]`\
Default: `[]`

The property types to include in listing results. Can include the following values: `"house", "unit apartment", "townhouse", "villa", "land", "acreage", "retire", "unitblock", "project-estate"`.

Empty array includes all property types in the search.

> Note: realestate.com.au's api doesn't always abide by these filters, so there will be a couple properties outside these filters.

##### keywords

Type: `string[]`\
Default: `[]`

Keywords to filter listings by. Listing descriptions will include one of the keywords.

##### sortType

Type: `string`\
Default: `"relevance"`

How to sort the listing results. Can be one of the following: `"relevance", "price-desc", "price-asc", "new-desc", "new-asc", "next-inspection-time", "next-auction-time"`

> Note: realestate.com.au's api doesn't always abide by these sortings, so there will be a couple properties that shouldn't have been included.

##### surroundingSuburbs

Type: `bool`\
Default: `true`

Whether to include listings from surrounding suburbs from the selected ones.

##### excludeNoSalePrice

Type: `bool`\
Default: `false`

Whether to exclude listings without any listed price.

##### excludeUnderContract

Type: `bool`\
Default: `false`

Whether to exclude listings that are currently under contract.

##### furnished

Type: `bool`\
Default: `null`

Whether to only include listings with/without existing furnishing.

##### petsAllowed

Type: `bool`\
Default: `null`

Whether to only include listings that allow/don't allow pets.

##### startPage

Type: `int`\
Default: `1`

The page number of results to start on, which is useful if you need to continue where you left off.

## API Response

**Note: `price` and `bond` is manually parsed from `priceText` and `bondText`, so it is not always accurate. Keep this in mind, and that `priceText` is the actual value from the API.**

The API returns a list of listings. The listing object is in the following format:

```
{
  auctionDate: "2023-06-17T13:00:00+10:00",
  availableDate: "now",
  badge: "Listed 3 hours ago",
  bathrooms: 2,
  bedrooms: 4,
  buildingSize: 1049,
  buildingSizeUnit: 'm²',
  description: "Set in the heart of Brisbane CBD, this immaculately presented property is...",
  fullAddress: "17 Jimmy Road, Brisbane CBD, QLD 4000",
  images: [
    "https://i2.au.reastatic.net/1144x888-format=webp/f68443d9727d79775ab3e961894815f5bbc3202ce2ee3d6fe2d356b9ca/image.jpg",
    ...
],
  imagesFloorplans: [
    "https://i2.au.reastatic.net/1144x888-format=webp/8d532077e8fdf1d4f3c142240a7e6b7613770356a29f5905cb6e1fdaf7c/image.jpg",
    ...
  ],
  inspections: [
    {
      endTime: "2023-06-11T13:15:00+08:00",
      label: "Open Sun 11 Jun 12:45 pm",
      labelShort: "Open Sun 11 Jun",
      startTime: "2023-06-11T12:45:00+08:00",
    },
    ...
  ],
  landSize: 450,
  landSizeUnit: "m²",
  listers: [
    {
      agentId: null,
      id: '2527777',
      jobTitle: null,
      name: 'Jimmy John',
      phone: '0403333333',
      url: 'https://www.realestate.com.au/agent/jimmy-john-2527777?cid={cid}',
    },
    ...
  ],
  listingCompanyId: 'FCYAAJ',
  listingCompanyName: 'COOL Property Group - WILSON',
  listingCompanyPhone: '0892598900',
  parkingSpaces: 2,
  postcode: '4000',
  price: 629000,
  priceText: 'OFFERS FROM $629,000',
  propertyId: '142231555',
  propertyType: 'house',
  shortAddress: '17 Jimmy Road',
  soldDate: null,
  state: 'QLD',
  suburb: 'Brisbane CBD',
  url: 'https://www.realestate.com.au/property-house-qld-brisbane-cbd-142231566',
  bondText: "$3,316 Bond",
  bond: 3316,
}
```

#### auctionDate

Type: `string`\
Default: `null`

Date of auction in ISO datetime, `null` if none is listed.

#### availableDate

Type: `string`\
Default: `null`

Date property is available in human readable format, `null` if none is listed.

#### badge

Type: `string`\
Default: `null`

Extra detail about listing (e.g. `Listed 3 hours ago`) 

#### bathrooms

Type: `int`\
Default: `null`

Number of bathrooms, `null` if none is listed.

#### bedrooms

Type: `int`\
Default: `null`

Number of bedrooms, `null` if none is listed.

#### buildingSize

Type: `int`\
Default: `null`

Size of building in square meters.

#### buildingSizeUnit

Type: `string`\
Default: `null`

Always `m²` if building size is listed.

#### description

Type: `string`\
Default: `null`

Listing description from the lister

#### fullAddress

Type: `string`\
Default: `null`

The full address of the property, including suburb, postcode and state.

#### images

Type: `string[]`\
Default: `[]`

Array of URLs to images of the home.

#### imagesFloorplans

Type: `string[]`\
Default: `[]`

Array of URLs to images of the floorplans.

#### inspections

Type: `object[]`\
Default: `[]`

Array of inspection objects, in the format:

```json
{
  endTime: '2023-06-11T13:15:00+08:00',
  label: 'Open Sun 11 Jun 12:45 pm',
  labelShort: 'Open Sun 11 Jun',
  startTime: '2023-06-11T12:45:00+08:00',
}
```

#### landSize

Type: `int`\
Default: `null`

Size of land in square meters.

#### landSizeUnit

Type: `string`\
Default: `null`

Always `m²` if land size is listed.

#### listers

Type: `object[]`\
Default: `[]`

Array of objects containing details of the property's listers. Example object:

```json
{
  agentId: '12980129801',
  id: '2527777',
  jobTitle: 'Agent',
  name: 'Jimmy John',
  phone: '0403333333',
  url: 'https://www.realestate.com.au/agent/jimmy-john-2527777?cid={cid}',
}
```

#### listingCompanyId

Type: `string`\
Default: `null`

Id of the company that listed the property.

#### listingCompanyName

Type: `string`\
Default: `null`

Name of the company that listed the property.

#### listingCompanyPhone

Type: `string`\
Default: `null`

Phone number of the company that listed the property.

#### parkingSpaces

Type: `int`\
Default: `null`

Number of parking spaces on the property.

#### postcode

Type: `string`\
Default: `null`

Postcode of the property.

#### price

Type: `int`\
Default: `null`

Price of the property, parsed from human readable price in `priceText`. May not be accurate.

#### priceText

Type: `string`\
Default: `null`

Price of property as listed on realestate.com.au in human readable text format.

#### propertyId

Type: `string`\
Default: `null`

Id of property on realestate.com.au

#### propertyType

Type: `string`\
Default: `null`

Type of property, which can be one of the following: `"house", "unit apartment", "townhouse", "villa", "land", "acreage", "retire", "unitblock", "project-estate"`

#### shortAddress

Type: `string`\
Default: `null`

Address of the property, excluding postcode, suburb and state.

#### soldDate

Type: `string`\
Default: `null`

Date property was sold, if it was sold.

#### state

Type: `string`\
Default: `null`

State of the listed property.

#### suburb

Type: `string`\
Default: `null`

Suburb of the listed property.

#### url

Type: `string`\
Default: `null`

Url to the realestate.com.au listing.

#### bondText

Type: `string`\
Default: `null`

Price of bond as listed on realestate.com.au in human readable text format.

#### bond

Type: `string`\
Default: `null`

Price of the bond, parsed from human readable price in `bondText`. May not be accurate.

## Acknowledgement

Thanks to tomquirk, who made the original [Python `realestate-com-au-api`](https://github.com/tomquirk/realestate-com-au-api) which this module is based on.
