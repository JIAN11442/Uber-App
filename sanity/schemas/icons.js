import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'icons',
  title: 'Icons',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Icons Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image Of Icons',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screen',
      type: 'array',
      title: 'For Which Screen',
      of: [{type: 'reference', to: [{type: 'screens'}]}],
    }),
  ],
})
