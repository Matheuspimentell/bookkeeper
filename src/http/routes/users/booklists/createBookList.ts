import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../../utils/authenticateJwt'

export async function createBookList(app: FastifyInstance) {
  app.post('/users/:username/book-lists', async (request, reply) => {
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }

    const createBookListParams = z.object({
      title: z.string(),
      description: z.optional(z.string()),
    })

    const bookListOwnerParams = z.object({
      username: z.string().min(6)
    })

    const { username } = bookListOwnerParams.parse(request.params)
    if(username !== requestUser.username) return reply.status(403).send()

    const { title, description } = createBookListParams.parse(request.body)

    const bookList = await prisma.bookList.create({
      data: {
        title,
        description,
        owner: {
          connect: {
            username
          },
        },
      }
    })

    if(!bookList) {
      return reply.status(500).send({ message: 'Couldn\'t create booklist.' })
    }

    return reply.status(201).send({
      book_list: {
        title: title,
        description: description,
        owner: username
      }
    })
  })
}