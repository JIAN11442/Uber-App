import {defineField, defineType, validation} from 'sanity'

export default defineType({
  name: 'rideCars',
  title: 'RideCar Types',
  type: 'document',
  fields: [
    defineField({
      name: 'rideCarsType',
      type: 'string',
      title: 'Type',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'multiplier',
      type: 'string',
      title: 'Multiplier',
    }),
    defineField({
      name: 'rideImage',
      type: 'image',
      title: 'Image',
    }),
  ],
})
