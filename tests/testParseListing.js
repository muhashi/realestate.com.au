import test from 'ava';
import parseListing from '../helpers/parseListing.js';

const emptyListingOutput = {
  auctionDate: null,
  availableDate: null,
  badge: null,
  bathrooms: null,
  bedrooms: null,
  buildingSize: null,
  buildingSizeUnit: null,
  description: null,
  fullAddress: null,
  images: [],
  imagesFloorplans: [],
  inspections: [],
  landSize: null,
  landSizeUnit: null,
  listers: [],
  listingCompanyId: null,
  listingCompanyName: null,
  listingCompanyPhone: null,
  parkingSpaces: null,
  postcode: null,
  price: null,
  priceText: null,
  propertyId: null,
  propertyType: null,
  shortAddress: null,
  soldDate: null,
  state: null,
  suburb: null,
  url: null,
};

const basicListingInput = {
  "__typename": "BuyResidentialListing",
  "inspections": [{"startTime":"2023-06-11T12:45:00+08:00","endTime":"2023-06-11T13:15:00+08:00","__typename":"Inspection","display":{"longLabel":"Open Sun 11 Jun 12:45 pm","__typename":"InspectionDisplay","shortLabel":"Open Sun 11 Jun"}}],
  "auction": {"dateTime":{"value": '2023-06-17T13:00:00+10:00',__typename: 'AuctionTime',display: {}},__typename: 'Auction'}, 
  "availableDate": {"display": "Available 23rd June","__typename": "AvailableDate"},
  "_links": {"canonical":{"href":"https://www.realestate.com.au/property-house-wa-southern+river-142231564","__typename":"Link","path":"/property-house-wa-southern+river-142231564"}, "__typename":"ResidentialListingLinks"}, 
  "address":{"display":{"shortAddress":"17 Jimmy Road","fullAddress":"17 Jimmy Road, Fake Place, WA 6110","__typename":"AddressDisplay"},"suburb":"Fake Place","state":"WA","postcode":"6110","__typename":"Address"},
  "id":"142231564",
  "parent":null,
  "aboveTheFoldId":"142231564",
  "badge": {"label": "Listed 3 hours ago"},
  "propertyType":{"id":"house","display":"House","__typename":"PropertyType"},
  "listingCompany":{"id":"FCYEUJ","name":"MINIC Property Group - WILSON","branding":{"primaryColour":"#022d5d","__typename":"ListingCompanyBranding","textColour":"#ffffff"},"media":{"logo":{"templatedUrl":"https://i2.au.reastatic.net/{size}/dc3a8cd34d6ba82b06446975e4f375d82cc68cfb084da22b618cdd80a795b342/logo.jpg","__typename":"Image"},"__typename":"ListingCompanyMedia"},"__typename":"Agency","_links":{"canonical":{"href":"https://www.realestate.com.au/agency/minic-property-group-wilson-FCYEUJ?cid={cid}","__typename":"AbsoluteLinks"},"__typename":"ListingCompanyLinks"},"businessPhone":"08 9259 8900","address":{"display":{"fullAddress":"Shop 6, Eureka Road, WILSON, WA 6107","__typename":"ListingCompanyAddressDisplay"},"__typename":"ListingCompanyAddress"}},
  "viewConfiguration":{"details":{"agencyBrandingOnSidePanel":true,"__typename":"ResidentialListingDetailsViewConfiguration","branding":{"header":{"size":"LARGE","__typename":"DetailsBrandingHeader"},"__typename":"DetailsBranding"},"posterBoard":true,"agencyInfo":true,"adverts":{"headerLeaderboard":false,"__typename":"DetailsAdvertsViewConfiguration"},"homeLoanCalculator":true},"__typename":"ResidentialListingViewConfiguration","searchResults":{"agencyBranding":true,"__typename":"ResidentialListingSearchResultsViewConfiguration","agentPhoto":true,"agentName":true,"adverts":{"photoGallery":false,"__typename":"SearchResultsAdvertsViewConfiguration"}}},
  "generalFeatures":{"bedrooms":{"value":4,"__typename":"IntValue"},"bathrooms":{"value":2,"__typename":"IntValue"},"parkingSpaces":{"value":2,"__typename":"IntValue"},"__typename":"GeneralFeatures"},"propertySizes":{"building":{"displayValue":"1,049","sizeUnit":{"displayValue":"ha","__typename":"PropertySizeUnit"},"__typename":"PropertySize"},"land":{"displayValue":"450","sizeUnit":{"displayValue":"m²","__typename":"PropertySizeUnit"},"__typename":"PropertySize"},"preferred":{"sizeType":"LAND","size":{"displayValue":"450","sizeUnit":{"displayValue":"m²","__typename":"PropertySizeUnit"},"__typename":"PropertySize"},"__typename":"PreferredPropertySize"},"__typename":"PropertySizes"},
  "price":{"display":"OFFERS FROM $829,000","__typename":"BuyPrice"},
  "media":{"statementOfInformation":null,"__typename":"ResidentialListingMedia","mainImage":{"templatedUrl":"https://i2.au.reastatic.net/{size}/f68443d9727d7971c819075ab3e961894815f5bbc3202ce2ee3d6fe2d356b9ca/image.jpg","__typename":"Image"},"images":[{"templatedUrl":"https://i2.au.reastatic.net/{size}/f68443d9727d7971c819075ab3e961894815f5bbc3202ce2ee3d6fe2d356b9ca/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/10ed4269bb4673a0bafa6c6efe280fdd5ad76391e4393c662d94e44ca60216ce/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/58cc4769896b13e9a7f8ad97ef5c0d963dba296be4d6a355ee7d240ef2a9448e/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/538ac66282ab566347e755a974157d33847dc7b150bf819c6a350e1e1edcb081/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/7890a92e53c6a9ead93318a7ec62d12fb1f2239026aebc19f2b5ae251dc24045/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/e8439acfa25f75ac92ab9b9edcc388d9888b1ee0d34b726034035d36ead64ebb/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/f7e2180fc8927fbd4234bcac3ef7160fa81a5765a7ffab89475d93453797b261/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/11f85684077d0cf1cb17a6dd27f1015ebbeca8d894b08e5b717ef5bc6a5ec44b/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/68974147ec37bd5e9e8d89d6ee3948063b3159e114828c9c03791d5d01ebff2a/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/6ee5fcbccb5cca8024a14a06b0cd928839e2574dcd98d891a552a9ef0ccceb38/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/09db4f00676e4376e16fe2c24c512b88956fcf8f9388a4dfdf093ddc0b53323d/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/9f97f06a8d18edf0425c04a09a2f712600d0a955c78f0289312f8474d135029a/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/66a091e500fde45c936a1c44c32c514b61a3a4b3b447b2787ebb6231eb8e363d/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/59bbd51c4e7505e9267a3c035e1ec2001d79b94d9876a0f56524e4cb6a85f8a4/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/318722f0046b3f0a80ff3961d37f2d021b061d92d8e8a34d08487aa600a51f01/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/2949fddbf70abd7056e6af46422053189fee85add0eb220de9ff24fab7f23460/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/c899f7dae7f7a63cc68326bf0655dc2e6d734b77768d7b2c8a51c92a06f8521d/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/6aa0f83081f3389562bd27f595ae6fb1fd3db472b61c0c2f18930c05fcc82003/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/aeff161f3742fead964c0d3967be69a286767b0e041c2499aa4cacac1be4715e/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/6aa0f83081f3389562bd27f595ae6fb1fd3db472b61c0c2f18930c05fcc82003/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/aeff161f3742fead964c0d3967be69a286767b0e041c2499aa4cacac1be4715e/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/26dc4d0b0626fb43770427786d26b53df3bb495f862ef610d6b5f4422c3244d3/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/fb847aee0db3f3f8d57da241a7dc74bc10ab0e48f45edb2d58a069913c455c12/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/2d0cdbbfc58f0a8657097115d600b53afee2031e70f35cbc067fbcad5bfc867c/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/3043f4803d657cade21f19d6c2c7c8759b01e3af4860224156de055efab32287/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/3043f4803d657cade21f19d6c2c7c8759b01e3af4860224156de055efab32287/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/4ca6b1d8c7a43627da7588a243b080bbc4ecce5ec9adb3ef963791c114b17e0d/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/2fac384326fbee8e568eef21ba638c65e28be1f3028ed9455cbd7b47a32c66a3/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/e0d263913da68431b7e13daaa44ca32e6fe9a60539361baed2a9c900821b17ad/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/e0d263913da68431b7e13daaa44ca32e6fe9a60539361baed2a9c900821b17ad/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/0b8eb3cb10088c7358d72fb27abe6c31702ad10ba04659141ed14b841ef9e3e7/image.jpg","__typename":"Image"},{"templatedUrl":"https://i2.au.reastatic.net/{size}/f4b4a5f8e4a8908399c416db8d4e23ceb27a5ae24422f6a645bd429bcee3ad47/image.jpg","__typename":"Image"}],"floorplans":[{"templatedUrl":"https://i2.au.reastatic.net/{size}/8d532077e8fdf1d4f3c14224002210a7e6b7613770356a29f5905cb6e1fdaf7c/image.jpg","__typename":"Image"}],"threeDimensionalTours":[],"videos":[]},
  "listers":[{"name":"Jimmy John","photo":{"templatedUrl":"https://i2.au.reastatic.net/{size}/a3b8c06e83e24833930b2e7a8264178ca9bd76780ffe0f9957a6f774e9325694/main.jpg","__typename":"Image"},"preferredPhoneNumber":"0403038192","_links":{"canonical":{"href":"https://www.realestate.com.au/agent/max-park-2527722?cid={cid}","__typename":"AbsoluteLinks"},"__typename":"ListerLinks"},"__typename":"Lister","id":"2527722","agentId":null,"jobTitle":null,"showInMediaViewer":false},{"name":"John Wayne","photo":{"templatedUrl":"https://i2.au.reastatic.net/{size}/bd5646affa487b0d0470c18c5afa46083acf7173c3b7a609859a5c8fcbbb449f/main.jpg","__typename":"Image"},"preferredPhoneNumber":"0450 435 696","_links":{"canonical":{"href":"https://www.realestate.com.au/agent/tim-huynh-1724338?cid={cid}","__typename":"AbsoluteLinks"},"__typename":"ListerLinks"},"__typename":"Lister","id":"1724338","agentId":null,"jobTitle":null,"showInMediaViewer":false}],
  "description":"Set in the heart of Fake Place, this immaculately presented property is surrounded with a wealth of stylish features. This beautiful and modern styled home is guaranteed to impress all families with no expense spared in this classy four-bedroom, two-bathroom family home. This property is a family's paradise so be quick to secure this fantastic property which offers great value.<br/><br/>Showcasing free flowing design, this outstanding property comfortably sits on 450sqm block. Completed with an expansive open living area, designer kitchen with stainless steel appliances, theatre room and a spacious front lounge. A short stroll to the local parks, cafés, restaurants, schools and shopping centres.<br/><br/>Features Included: <br/>- Spacious Master Bedroom with walk-in robe and private en-suite<br/>- Three generously sized bedrooms<br/>- Stylish bathrooms<br/>- Open plan kitchen, family, and meals area<br/>- Stone kitchen with stainless steel appliances and walk in pantry<br/>- Ducted reverse cycle aircon system<br/>- Spacious front lounge<br/>- Theatre Room<br/>- Total Floor plan of 219 sqm comfortably sitting on 450 sqm of land built in 2021.<br/>- Close proximity to the Southern Grove Primary School, Fake Place College and Fake Place Square Shopping Centre<br/><br/>Make this your #1 on your viewing list today!<br/><br/>For more information, please contact Jimmy John 0403 038 647 or John Wayne on 0450 435 696<br/><br/>Disclaimer: All information contained has been prepared for advertising and marketing purposes only and is not intended to form part of any contract. Whilst every effort is made for the accuracy of this information, which is believed to be correct, neither the Agent nor the client nor employees of both, guarantee their accuracy and accept no responsibility for the results of any actions taken, or reliance placed upon this document. Interested parties should make independent enquiries and rely on their personal judgement to satisfy themselves in all respects.",
  "productDepth":"premiere"
};

const basicListingOutput = {
  auctionDate: "2023-06-17T13:00:00+10:00",
  availableDate: "23rd June",
  badge: "Listed 3 hours ago",
  bathrooms: 2,
  bedrooms: 4,
  buildingSize: 1049,
  buildingSizeUnit: 'ha',
  description: 'Set in the heart of Fake Place, this immaculately presented property is surrounded with a wealth of stylish features. This beautiful and modern styled home is guaranteed to impress all families with no expense spared in this classy four-bedroom, two-bathroom family home. This property is a family\'s paradise so be quick to secure this fantastic property which offers great value.<br/><br/>Showcasing free flowing design, this outstanding property comfortably sits on 450sqm block. Completed with an expansive open living area, designer kitchen with stainless steel appliances, theatre room and a spacious front lounge. A short stroll to the local parks, cafés, restaurants, schools and shopping centres.<br/><br/>Features Included: <br/>- Spacious Master Bedroom with walk-in robe and private en-suite<br/>- Three generously sized bedrooms<br/>- Stylish bathrooms<br/>- Open plan kitchen, family, and meals area<br/>- Stone kitchen with stainless steel appliances and walk in pantry<br/>- Ducted reverse cycle aircon system<br/>- Spacious front lounge<br/>- Theatre Room<br/>- Total Floor plan of 219 sqm comfortably sitting on 450 sqm of land built in 2021.<br/>- Close proximity to the Southern Grove Primary School, Fake Place College and Fake Place Square Shopping Centre<br/><br/>Make this your #1 on your viewing list today!<br/><br/>For more information, please contact Jimmy John 0403 038 647 or John Wayne on 0450 435 696<br/><br/>Disclaimer: All information contained has been prepared for advertising and marketing purposes only and is not intended to form part of any contract. Whilst every effort is made for the accuracy of this information, which is believed to be correct, neither the Agent nor the client nor employees of both, guarantee their accuracy and accept no responsibility for the results of any actions taken, or reliance placed upon this document. Interested parties should make independent enquiries and rely on their personal judgement to satisfy themselves in all respects.',
  fullAddress: '17 Jimmy Road, Fake Place, WA 6110',
  images: [
    'https://i2.au.reastatic.net/1144x888-format=webp/f68443d9727d7971c819075ab3e961894815f5bbc3202ce2ee3d6fe2d356b9ca/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/10ed4269bb4673a0bafa6c6efe280fdd5ad76391e4393c662d94e44ca60216ce/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/58cc4769896b13e9a7f8ad97ef5c0d963dba296be4d6a355ee7d240ef2a9448e/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/538ac66282ab566347e755a974157d33847dc7b150bf819c6a350e1e1edcb081/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/7890a92e53c6a9ead93318a7ec62d12fb1f2239026aebc19f2b5ae251dc24045/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/e8439acfa25f75ac92ab9b9edcc388d9888b1ee0d34b726034035d36ead64ebb/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/f7e2180fc8927fbd4234bcac3ef7160fa81a5765a7ffab89475d93453797b261/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/11f85684077d0cf1cb17a6dd27f1015ebbeca8d894b08e5b717ef5bc6a5ec44b/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/68974147ec37bd5e9e8d89d6ee3948063b3159e114828c9c03791d5d01ebff2a/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/6ee5fcbccb5cca8024a14a06b0cd928839e2574dcd98d891a552a9ef0ccceb38/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/09db4f00676e4376e16fe2c24c512b88956fcf8f9388a4dfdf093ddc0b53323d/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/9f97f06a8d18edf0425c04a09a2f712600d0a955c78f0289312f8474d135029a/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/66a091e500fde45c936a1c44c32c514b61a3a4b3b447b2787ebb6231eb8e363d/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/59bbd51c4e7505e9267a3c035e1ec2001d79b94d9876a0f56524e4cb6a85f8a4/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/318722f0046b3f0a80ff3961d37f2d021b061d92d8e8a34d08487aa600a51f01/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/2949fddbf70abd7056e6af46422053189fee85add0eb220de9ff24fab7f23460/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/c899f7dae7f7a63cc68326bf0655dc2e6d734b77768d7b2c8a51c92a06f8521d/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/6aa0f83081f3389562bd27f595ae6fb1fd3db472b61c0c2f18930c05fcc82003/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/aeff161f3742fead964c0d3967be69a286767b0e041c2499aa4cacac1be4715e/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/6aa0f83081f3389562bd27f595ae6fb1fd3db472b61c0c2f18930c05fcc82003/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/aeff161f3742fead964c0d3967be69a286767b0e041c2499aa4cacac1be4715e/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/26dc4d0b0626fb43770427786d26b53df3bb495f862ef610d6b5f4422c3244d3/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/fb847aee0db3f3f8d57da241a7dc74bc10ab0e48f45edb2d58a069913c455c12/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/2d0cdbbfc58f0a8657097115d600b53afee2031e70f35cbc067fbcad5bfc867c/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/3043f4803d657cade21f19d6c2c7c8759b01e3af4860224156de055efab32287/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/3043f4803d657cade21f19d6c2c7c8759b01e3af4860224156de055efab32287/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/4ca6b1d8c7a43627da7588a243b080bbc4ecce5ec9adb3ef963791c114b17e0d/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/2fac384326fbee8e568eef21ba638c65e28be1f3028ed9455cbd7b47a32c66a3/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/e0d263913da68431b7e13daaa44ca32e6fe9a60539361baed2a9c900821b17ad/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/e0d263913da68431b7e13daaa44ca32e6fe9a60539361baed2a9c900821b17ad/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/0b8eb3cb10088c7358d72fb27abe6c31702ad10ba04659141ed14b841ef9e3e7/image.jpg',
    'https://i2.au.reastatic.net/1144x888-format=webp/f4b4a5f8e4a8908399c416db8d4e23ceb27a5ae24422f6a645bd429bcee3ad47/image.jpg',
  ],
  imagesFloorplans: [
    'https://i2.au.reastatic.net/1144x888-format=webp/8d532077e8fdf1d4f3c14224002210a7e6b7613770356a29f5905cb6e1fdaf7c/image.jpg',
  ],
  inspections: [
    {
      endTime: '2023-06-11T13:15:00+08:00',
      label: 'Open Sun 11 Jun 12:45 pm',
      labelShort: 'Open Sun 11 Jun',
      startTime: '2023-06-11T12:45:00+08:00',
    },
  ],
  landSize: 450,
  landSizeUnit: 'm²',
  listers: [
    {
      agentId: null,
      id: '2527722',
      jobTitle: null,
      name: 'Jimmy John',
      phone: '0403038192',
      url: 'https://www.realestate.com.au/agent/max-park-2527722?cid={cid}',
    },
    {
      agentId: null,
      id: '1724338',
      jobTitle: null,
      name: 'John Wayne',
      phone: '0450435696',
      url: 'https://www.realestate.com.au/agent/tim-huynh-1724338?cid={cid}',
    },
  ],
  listingCompanyId: 'FCYEUJ',
  listingCompanyName: 'MINIC Property Group - WILSON',
  listingCompanyPhone: '0892598900',
  parkingSpaces: 2,
  postcode: '6110',
  price: 829000,
  priceText: 'OFFERS FROM $829,000',
  propertyId: '142231564',
  propertyType: 'house',
  shortAddress: '17 Jimmy Road',
  soldDate: null,
  state: 'WA',
  suburb: 'Fake Place',
  url: 'https://www.realestate.com.au/property-house-wa-southern+river-142231564',
};

test('parseListing non-object input', t => {
  t.is(parseListing(""), null);
  t.is(parseListing(), null);
  t.is(parseListing(null), null);
  t.is(parseListing(6), null);
});

test('parseListing empty object input', t => {
  t.deepEqual(parseListing({}), emptyListingOutput);
});

test('parseListing basic case', t => {
  t.deepEqual(parseListing(basicListingInput), basicListingOutput);
});
