import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../utils/authenticateJwt'

export async function deleteBook(app: FastifyInstance) {
  app.delete('/books/:isbn', async(request, reply) => {
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }
    
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
      return reply.status(404).send({ message: 'Couldn\'t delete book information.' })
    }

    return reply.status(204).send()
  })
}