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


export async function deleteListEntry(app: FastifyInstance) {
  app.delete('/users/:username/book-lists/:book_list_id/list-entries/:entry_id', opts, 
  async (request, reply) => {
    const listEntryInformation = z.object({
      username: z.string().min(6),
      book_list_id: z.number().int(),
      entry_id: z.number().int()
    })

    const { username, book_list_id, entry_id } = listEntryInformation.parse(request.params)

    const listEntry = await prisma.listEntry.delete({
      where: {
        id: entry_id,
        AND: {
          bookListId: book_list_id
        }
      }
    })

    if(!listEntry) {
      return reply.status(500).send({ message: 'Couldn\'t delete list entry.' })
    }

    return reply.status(204).send()
  })
}