import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'addFavourites',
  title: 'Favourites Location',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      type: 'string',
      title: 'Address',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lat',
      type: 'number',
      title: 'Latitude',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lng',
      type: 'number',
      title: 'Longtitude',
      validation: (Rule) => Rule.required(),
    }),

    // defineField({
    //   name: 'favourite_type',
    //   type: 'array',
    //   title: 'Favourite Type',
    //   of: [{type: 'reference', to: [{type: 'favouriteTypes'}]}],
    // }),
  ],
})
