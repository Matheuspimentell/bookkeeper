import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

export async function getBookLists(app: FastifyInstance) {
  app.get('/users/:username/book-lists', async (request, reply) => {
    const bookListOwnerParams = z.object({
      username: z.string().min(6)
    })

    const { username } = bookListOwnerParams.parse(request.params)

    const bookLists = await prisma.bookList.findMany({
      where: {
        owner: {
          username
        }
      }
    })

    if(!bookLists) {
      return reply.status(500).send({ message: 'Couldn\'t get booklists' })
    }

    return reply.send({
      owner: username,
      book_lists: bookLists
    })
  })
}