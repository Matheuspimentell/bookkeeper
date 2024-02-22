import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

export async function createBookList(app: FastifyInstance) {
  app.post('/users/:username/book-lists', async (request, reply) => {
    const createBookListParams = z.object({
      title: z.string(),
      description: z.optional(z.string()),
    })

    const bookListOwnerParams = z.object({
      username: z.string().min(6)
    })

    const { username } = bookListOwnerParams.parse(request.params)
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