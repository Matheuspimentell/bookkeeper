import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function findBook(app: FastifyInstance) {
  app.get('/books/:isbn', async (request, reply) => {
    const bookParams = z.object({
      isbn: z.string()
    })

    const { isbn } = bookParams.parse(request.params)

    const book = await prisma.book.findUnique({
      where: {
        isbn
      }
    })

    if(!book) {
      return reply.status(404).send({ message: 'Book not found.' })
    }

    return reply.send({ book })
  })
}