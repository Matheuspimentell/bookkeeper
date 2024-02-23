import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function getBooks(app: FastifyInstance) {
  app.get('/books/:isbn?', async (request, reply) => {
    const bookInformation = z.object({
      isbn: z.optional(z.string().min(10))
    })

    const { isbn } = bookInformation.parse(request.params)

    if(!isbn) {
      const books = await prisma.book.findMany()

      return reply.send({ books })
    }

    const book = await prisma.book.findUnique({
      where: {
        isbn
      }
    })

    return reply.send({ book })
  })
}