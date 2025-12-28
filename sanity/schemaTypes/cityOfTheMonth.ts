import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'cityOfTheMonth',
    title: 'City of the Month',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Display Title',
            type: 'string',
            initialValue: 'City of the Month',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'town',
            title: 'Featured Town',
            type: 'reference',
            to: [{ type: 'town' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'month',
            title: 'Month Name',
            type: 'string',
            description: 'The month this city is featured for (e.g., "March")',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Feature Description',
            type: 'text',
            description: 'The reason why this city is featured this month.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Custom Featured Image',
            type: 'image',
            description: 'Optional: Use a specific image for this feature. If left blank, it will use the town\'s main image.',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'active',
            title: 'Is Active?',
            type: 'boolean',
            initialValue: true,
            description: 'Only one City of the Month should be active at a time.',
        }),
    ],
    preview: {
        select: {
            title: 'town.name',
            subtitle: 'month',
            media: 'featuredImage',
            townMedia: 'town.image',
        },
        prepare(selection) {
            const { title, subtitle, media, townMedia } = selection
            return {
                title: title ? `Featured: ${title}` : 'No Town Selected',
                subtitle: subtitle || 'No month set',
                media: media || townMedia,
            }
        },
    },
})
