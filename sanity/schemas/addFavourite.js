import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'addFavourites',
  title: 'Favourites Location',
  type: 'document',
  fields: [
    defineField({
      name: 'location',
      type: 'string',
      title: 'Location',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Address',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'favourite_type',
      type: 'array',
      title: 'Favourite Type',
      of: [{type: 'reference', to: [{type: 'favouriteTypes'}]}],
    }),
  ],
})
