import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'data',
  title: 'Data',
  type: 'document',
  fields: [
    defineField({
      name: 'data_name',
      title: 'Data Name',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'icons'}]}],
    }),
  ],
})
