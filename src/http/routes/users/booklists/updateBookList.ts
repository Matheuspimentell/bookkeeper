import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../../utils/authenticateJwt'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      id: { type: 'integer' }
    }
  }
}

export async function updateBookList(app: FastifyInstance) {
  app.patch('/users/:username/book-lists/:id', opts, async (request, reply) => {
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }

    const bookListInformation = z.object({
      username: z.string().min(6),
      id: z.number().int()
    })

    const booklistParams = z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string())
    })
    
    const { username, id } = bookListInformation.parse(request.params)
    if(username !== requestUser.username) return reply.status(403).send()

    const { title, description } = booklistParams.parse(request.body)
    
    const bookList = await prisma.bookList.update({
      where: {
        id,
        AND: {
          owner: {
            username
          }
        }
      },
      data: {
        title,
        description
      }
    }).catch(e => { 
      return reply.status(500).send({ message: 'Couldn\'t update book list.' })
    })

    return reply.send({
      book_list: {
        owner: username,
        title: bookList.title,
        description: bookList.description,
        created_at: bookList.created_at,
        updated_at: bookList.updated_at
      }
    })
  })
}