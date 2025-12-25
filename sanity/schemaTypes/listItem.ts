import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'listItem',
    title: 'Top 5 List Item',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Place Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
            description: 'Unique URL path for this item',
        }),
        defineField({
            name: 'town',
            title: 'Town',
            type: 'string',
            options: {
                list: [
                    { title: 'Kotor', value: 'kotor' },
                    { title: 'Budva', value: 'budva' },
                    { title: 'Tivat', value: 'tivat' },
                    { title: 'Herceg Novi', value: 'herceg-novi' },
                    { title: 'Ulcinj', value: 'ulcinj' },
                    { title: 'Podgorica', value: 'podgorica' },
                    { title: 'Cetinje', value: 'cetinje' },
                    { title: 'Nikšić', value: 'niksic' },
                    { title: 'Žabljak', value: 'zabljak' },
                    { title: 'Kolašin', value: 'kolasin' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: '💎 Hidden Gems', value: 'Hidden Gems' },
                    { title: '🧭 Activities', value: 'Activities' },
                    { title: '🍽️ Food & Drinks', value: 'Food & Drinks' },
                    { title: '🥪 Street Food', value: 'Street Food' },
                    { title: '🏛️ Cultural Heritage', value: 'Cultural Heritage' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Brief Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required().max(300),
            description: 'Catchy summary shown on the card (max 300 characters)',
        }),
        defineField({
            name: 'reason',
            title: 'Why Top 5?',
            type: 'text',
            rows: 2,
            validation: (Rule) => Rule.required(),
            description: 'Local insight - why is this in the top 5?',
        }),
        defineField({
            name: 'content',
            title: 'Detailed Content',
            type: 'array',
            description: 'The long-form story and details about this gem',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'heading', title: 'Heading', type: 'string' },
                        { name: 'body', title: 'Body Text', type: 'text', rows: 5 },
                    ],
                },
            ],
        }),
        defineField({
            name: 'images',
            title: 'Main Card Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
            validation: (Rule) => Rule.required().min(1).max(5),
            description: 'Primary images for the card and gallery header',
        }),
        defineField({
            name: 'gallery',
            title: 'Additional Gallery Photos',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
            description: 'Extra photos for the deep-dive page',
        }),
        defineField({
            name: 'location',
            title: 'Location Details',
            type: 'object',
            fields: [
                {
                    name: 'address',
                    title: 'Address',
                    type: 'string',
                },
                {
                    name: 'coordinates',
                    title: 'GPS Coordinates',
                    type: 'geopoint',
                },
            ],
        }),
        defineField({
            name: 'features',
            title: 'Amenities & Features',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'e.g. WiFi, Parking, Great View, Local produce',
        }),
        defineField({
            name: 'contactInfo',
            title: 'Contact Information',
            type: 'object',
            fields: [
                { name: 'website', title: 'Website', type: 'url' },
                { name: 'instagram', title: 'Instagram Handle', type: 'string', description: 'e.g. @visit_kotor' },
                { name: 'phone', title: 'Phone Number', type: 'string' },
            ],
        }),
        defineField({
            name: 'verifiedBy',
            title: 'Verified By',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'ambassador' }] }],
            description: 'Ambassadors who verified this location',
        }),
        defineField({
            name: 'verificationDate',
            title: 'Last Verified',
            type: 'date',
            description: 'When was this last checked in person?',
        }),
        defineField({
            name: 'rank',
            title: 'Rank (1-5)',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5).integer(),
            description: 'Position in the Top 5 list',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: '📝 Draft', value: 'draft' },
                    { title: '⏳ Pending Review', value: 'pending' },
                    { title: '✅ Published', value: 'published' },
                    { title: '🔄 Needs Verification', value: 'needs_verification' },
                ],
            },
            initialValue: 'draft',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            town: 'town',
            category: 'category',
            media: 'images.0',
            status: 'status',
            rank: 'rank',
        },
        prepare({ title, town, category, media, status, rank }) {
            const statusEmoji: Record<string, string> = {
                draft: '📝',
                pending: '⏳',
                published: '✅',
                needs_verification: '🔄',
            }

            return {
                title: `#${rank} ${title}`,
                subtitle: `${town} • ${category} • ${statusEmoji[status] || ''} ${status}`,
                media,
            }
        },
    },
})
