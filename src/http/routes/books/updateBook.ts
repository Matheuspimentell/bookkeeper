import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function updateBook(app: FastifyInstance) {
  app.patch('/books/:isbn', async(request, reply) => {
    const bookParams = z.object({
      isbn: z.string().min(10)
    })

    const { isbn } = bookParams.parse(request.params)

    const updateBookParams = z.object({
      title: z.optional(z.string().min(3)),
      authors: z.optional(z.array(z.string()).min(1)),
      publisher: z.optional(z.string()),
      publicationYear: z.optional(z.number().int()),
      genres: z.optional(z.array(z.string()).min(1))
    })

    const { 
      title, authors, publisher,
      publicationYear, genres } = updateBookParams.parse(request.body)

    const book = await prisma.book.update({
      data: {
        title,
        authors,
        publisher,
        publicationYear,
        genres
      },
      where: {
        isbn
      }
    }).catch(e => {
      return reply.status(500).send({ message: 'Couldn\'t update book information.' })
    })

    return reply.send({ book })
  })
}