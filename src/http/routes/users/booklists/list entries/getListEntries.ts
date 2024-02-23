import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      book_list_id: { type: 'integer' },
    }
  }
}


export async function getListEntries(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:book_list_id/list-entries', opts, 
  async (request, reply) => {
    const bookListInformation = z.object({
      username: z.string().min(6),
      book_list_id: z.number().int(),
    })

    const { username, book_list_id } = bookListInformation.parse(request.params)

    const listEntries = await prisma.listEntry.findMany({
      where: {
        bookListId: book_list_id
      }
    })

    if(!listEntries) {
      return reply.status(500).send({ message: 'Couldn\'t get list entries information.' })
    }

    return reply.send({
      book_list_id: book_list_id,
      list_entries: listEntries
    })
  })
}