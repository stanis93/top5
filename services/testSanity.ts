// Quick test script to see what's in Sanity
// Run this in browser console or check the output

import { sanityClient } from './sanityClient';

async function testSanityData() {
    console.log('🧪 Testing Sanity Connection...\n');

    // Test 1: Fetch ALL list items (no filters)
    const allQuery = `*[_type == "listItem"] {
    _id,
    name,
    town,
    category,
    status,
    rank
  }`;

    const allItems = await sanityClient.fetch(allQuery);
    console.log('📦 ALL List Items:', allItems);
    console.log(`Total: ${allItems.length} items\n`);

    // Test 2: Fetch only published items
    const publishedQuery = `*[_type == "listItem" && status == "published"] {
    _id,
    name,
    town,
    category,
    status,
    rank
  }`;

    const publishedItems = await sanityClient.fetch(publishedQuery);
    console.log('✅ Published Items:', publishedItems);
    console.log(`Total: ${publishedItems.length} published items\n`);

    // Test 3: Fetch Cetinje items specifically
    const cetinjeQuery = `*[_type == "listItem" && town == "cetinje"] {
    _id,
    name,
    town,
    category,
    status,
    rank
  }`;

    const cetinjeItems = await sanityClient.fetch(cetinjeQuery);
    console.log('🏛️ Cetinje Items:', cetinjeItems);
    console.log(`Total: ${cetinjeItems.length} Cetinje items\n`);

    // Test 4: Check what town values exist
    const townValuesQuery = `*[_type == "listItem"].town`;
    const townValues = await sanityClient.fetch(townValuesQuery);
    console.log('🗺️ All town values in database:', [...new Set(townValues)]);

    // Test 5: Check what category values exist
    const categoryValuesQuery = `*[_type == "listItem"].category`;
    const categoryValues = await sanityClient.fetch(categoryValuesQuery);
    console.log('📂 All category values in database:', [...new Set(categoryValues)]);
}

// Auto-run
testSanityData().catch(console.error);

export { testSanityData };
