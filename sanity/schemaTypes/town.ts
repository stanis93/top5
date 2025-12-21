import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'town',
    title: 'Town',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Town Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug (ID)',
            type: 'slug',
            description: 'Used as the ID (e.g., kotor, budva). Must match the hardcoded IDs if migrating.',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'region',
            title: 'Region',
            type: 'string',
            options: {
                list: [
                    { title: 'Coastal', value: 'Coastal' },
                    { title: 'Central', value: 'Central' },
                    { title: 'Northern', value: 'Northern' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description: 'Short description shown on the card (e.g., "Where history meets the fjord")',
        }),
        defineField({
            name: 'image',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Sort Order',
            type: 'number',
            description: 'Lower numbers appear first',
            initialValue: 99,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'region',
            media: 'image',
        },
    },
})
