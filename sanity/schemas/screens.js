import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'screens',
  title: 'Screens',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Screen Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'Screen_data',
      title: 'Screen Data',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'data'}]}],
    }),
  ],
})
