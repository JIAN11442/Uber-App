import {defineField, defineType, validation} from 'sanity'

export default defineType({
  name: 'favouriteTypes',
  title: 'Favourite Types',
  type: 'document',
  fields: [
    defineField({
      name: 'favouriteTypesName',
      type: 'string',
      title: 'Favourites Type',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroiconsName',
      type: 'string',
      title: 'Heroicons Name',
    }),
    defineField({
      name: 'status',
      type: 'boolean',
      title: 'Status',
    }),
  ],
})
