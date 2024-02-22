import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

const opts = {
  schema: {
    params: {
      id: { type: 'integer' }
    }
  }
}

export async function findBookList(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:id', opts, async (request, reply) => {
    const booklistParams = z.object({
      id: z.number().int()
    })

    const userParams = z.object({
      username: z.string().min(6)
    })

    const { id } = booklistParams.parse(request.params)
    const { username } = userParams.parse(request.params)

    const bookList = await prisma.bookList.findUnique({
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

    if(!bookList) {
      return reply.status(500).send({ message: 'Couldn\'t find the specified book list.' })
    }

    return reply.send({
      title: bookList.title,
      description: bookList.description,
      entries: bookList.listEntries
    })
  })
}