import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function deleteBook(app: FastifyInstance) {
  app.delete('/books/:isbn', async(request, reply) => {
    const deleteBookParams = z.object({
      isbn: z.string().min(10)
    })

    const { isbn } = deleteBookParams.parse(request.params)

    const book = await prisma.book.delete({
      where: {
        isbn
      }
    })

    if(!book) {
      return reply.status(500).send({ message: 'Couldn\'t delete book information.' })
    }

    return reply.send({ message: 'Book information deleted successfully.' })
  })
}