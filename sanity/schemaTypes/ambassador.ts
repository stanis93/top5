import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'ambassador',
    title: 'Ambassador',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Full Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Ambassador Title',
            type: 'string',
            placeholder: 'e.g., Kotor Ambassador',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
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
        }),
        defineField({
            name: 'avatar',
            title: 'Profile Picture',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'title',
            media: 'avatar',
        },
    },
})
