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

export async function deleteBookList(app: FastifyInstance) {
  app.delete('/users/:username/book-lists/:id', opts, async (request, reply) => {
    const booklistParams = z.object({
      id: z.number().int()
    })

    const userParams = z.object({
      username: z.string().min(6)
    })

    const { id } = booklistParams.parse(request.params)
    const { username } = userParams.parse(request.params)

    const booklist = await prisma.bookList.delete({
      where: {
        id,
        owner: {
          username
        }
      }
    })

    if(!booklist) {
      return reply.status(500).send({ message: 'Couldn\'t delete the booklist.' })
    }

    return reply.status(204).send()
  })
}