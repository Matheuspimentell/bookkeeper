import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

export async function findBookList(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:id', async (request, reply) => {
    const booklistParams = z.object({
      id: z.number().int()
    })

    const userParams = z.object({
      username: z.string().min(6)
    })

    const { id } = booklistParams.parse(request.params)
    const { username } = userParams.parse(request.params)

    const booklist = await prisma.bookList.findUnique({
      where: {
        id,
        owner: {
          username
        }
      },
      include: {
        listEntries: true
      }
    })

    if(!booklist) {
      return reply.status(500).send({ message: 'Couldn\'t find the specified book list.' })
    }

    return reply.send({
      title: booklist.title,
      entries: booklist.listEntries
    })
  })
}