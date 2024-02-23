import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      list_id: { type: 'integer' }
    }
  }
}

export async function getBookLists(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:list_id?', opts, async (request, reply) => {
    const bookListOwnerParams = z.object({
      username: z.string().min(6),
      list_id: z.optional(z.number().int())
    })

    const { username, list_id } = bookListOwnerParams.parse(request.params)

    if(!list_id) {
      const bookLists = await prisma.bookList.findMany({
        where: {
          owner: {
            username
          }
        }
      })

      return reply.send({
        owner: username,
        book_lists: bookLists
      })
    }

    const bookList = await prisma.bookList.findUnique({
      where: {
        id: list_id
      }
    })

    return reply.send({
      owner: username,
      book_list: bookList
    })
  })
}