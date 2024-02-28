import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../../utils/authenticateJwt'

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
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }

    const bookListOwnerParams = z.object({
      username: z.string().min(6),
      list_id: z.optional(z.number().int())
    })

    const { username, list_id } = bookListOwnerParams.parse(request.params)
    if(username !== requestUser.username) return reply.status(403).send()

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