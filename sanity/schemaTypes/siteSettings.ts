import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
            initialValue: 'The real Montenegro.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'text',
            initialValue: 'Hand-picked Top 5 lists by local residents. No tourist traps, no bought reviews. Just the spots we actually visit.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heroImage',
            title: 'General Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'ctaPrimaryText',
            title: 'Primary CTA Text',
            type: 'string',
            initialValue: 'Explore Cities',
        }),
        defineField({
            name: 'ctaSecondaryText',
            title: 'Secondary CTA Text',
            type: 'string',
            initialValue: 'Read Stories',
        }),
        defineField({
            name: 'footerText',
            title: 'Footer Text',
            type: 'string',
        }),
    ],
})
