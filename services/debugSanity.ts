import { sanityClient } from './sanityClient';

/**
 * Debug helper to check what's in Sanity
 */
export async function debugSanityData() {
    console.log('🔍 Debugging Sanity Data...\n');

    // Fetch ALL list items (regardless of status)
    const allItemsQuery = `*[_type == "listItem"] {
    _id,
    name,
    town,
    category,
    status,
    rank
  }`;

    try {
        const allItems = await sanityClient.fetch(allItemsQuery);
        console.log('📦 All List Items in Sanity:', allItems);
        console.log(`\nTotal items: ${allItems.length}\n`);

        if (allItems.length > 0) {
            console.log('📊 Breakdown by town:');
            const byTown = allItems.reduce((acc: any, item: any) => {
                acc[item.town] = (acc[item.town] || 0) + 1;
                return acc;
            }, {});
            console.table(byTown);

            console.log('\n📊 Breakdown by status:');
            const byStatus = allItems.reduce((acc: any, item: any) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            }, {});
            console.table(byStatus);

            console.log('\n📋 Cetinje items specifically:');
            const cetinjeItems = allItems.filter((item: any) =>
                item.town.toLowerCase().includes('cetinje')
            );
            console.table(cetinjeItems);
        }

        return allItems;
    } catch (error) {
        console.error('❌ Error fetching from Sanity:', error);
        return [];
    }
}

// Auto-run on import in development
if (import.meta.env.DEV) {
    debugSanityData();
}
