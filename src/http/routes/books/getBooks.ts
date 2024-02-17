import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function getBooks(app: FastifyInstance) {
  app.get('/books', async (request, reply) => {
    const books = await prisma.book.findMany()

    return reply.send({ books })
  })
}