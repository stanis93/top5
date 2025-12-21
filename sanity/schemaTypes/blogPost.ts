import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Curation', value: 'Curation' },
                    { title: 'Hidden Gems', value: 'Hidden Gems' },
                    { title: 'Food & Drinks', value: 'Food & Drinks' },
                    { title: 'Street Food', value: 'Street Food' },
                    { title: 'Activities', value: 'Activities' },
                    { title: 'Cultural Heritage', value: 'Cultural Heritage' },
                    { title: 'Outdoors', value: 'Outdoors' },
                    { title: 'Nightlife', value: 'Nightlife' },
                    { title: 'Local Tips', value: 'Local Tips' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'ambassador' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required().max(200),
            description: 'Short summary (max 200 characters)',
        }),
        defineField({
            name: 'hero',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Content Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'heading',
                            title: 'Section Heading',
                            type: 'string',
                        },
                        {
                            name: 'body',
                            title: 'Section Body',
                            type: 'text',
                            rows: 5,
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'heading',
                            subtitle: 'body',
                        },
                        prepare({ title, subtitle }) {
                            return {
                                title: title || 'No heading',
                                subtitle: subtitle?.substring(0, 60) + '...',
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'takeaway',
            title: 'Key Takeaway',
            type: 'text',
            rows: 2,
            validation: (Rule) => Rule.required(),
            description: 'Main lesson or insight from this post',
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
        }),
        defineField({
            name: 'readingTime',
            title: 'Reading Time',
            type: 'string',
            placeholder: 'e.g., 5 min read',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
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
                    { title: '📦 Archived', value: 'archived' },
                ],
            },
            initialValue: 'draft',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'hero',
            status: 'status',
        },
        prepare({ title, author, media, status }) {
            const statusEmoji: Record<string, string> = {
                draft: '📝',
                pending: '⏳',
                published: '✅',
                archived: '📦',
            }

            return {
                title,
                subtitle: `${author} • ${statusEmoji[status] || ''} ${status}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Published Date, Old',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
    ],
})
