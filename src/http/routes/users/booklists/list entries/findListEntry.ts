import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      book_list_id: { type: 'integer' },
      entry_id: { type: 'integer' }
    }
  }
}


export async function findListEntry(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:book_list_id/list-entries/:entry_id', opts,
   async (request, reply) => {
    const listEntryInformation = z.object({
      username: z.string().min(6),
      book_list_id: z.number().int(),
      entry_id: z.number().int()
    })

    const { username, book_list_id, entry_id } = listEntryInformation.parse(request.params)

    const listEntry = await prisma.listEntry.findUnique({
      where: {
        id: entry_id,
        AND: {
          bookListId: book_list_id
        }
      }
    })

    if(!listEntry) {
      return reply.status(404).send({ message: 'List Entry not found.' })
    }

    return reply.send({
      list_entry: {
        book_isbn: listEntry.bookIsbn,
        score: listEntry.score,
        review: listEntry.review,
        book_list_id: listEntry.bookListId
      }
    })
  })
}