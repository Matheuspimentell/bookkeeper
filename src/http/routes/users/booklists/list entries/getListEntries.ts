import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      list_id: { type: 'integer' },
      entry_id: { type: 'integer' }
    }
  }
}


export async function getListEntries(app: FastifyInstance) {
  app.get('/users/:username/book-lists/:list_id/list-entries/:entry_id?', opts, 
  async (request, reply) => {
    const bookListInformation = z.object({
      username: z.string().min(6),
      list_id: z.number().int(),
      entry_id: z.optional(z.number().int())
    })

    const { username, list_id, entry_id } = bookListInformation.parse(request.params)

    if(!entry_id) {
      const listEntries = await prisma.listEntry.findMany({
        where: {
          bookListId: list_id
        }
      })
  
      return reply.send({
        book_list_id: list_id,
        list_entries: listEntries
      })
    }

    const listEntry = await prisma.listEntry.findUnique({
      where: {
        id: entry_id,
        AND: {
          bookListId: list_id
        }
      }
    })

    return reply.send({
      book_list_id: list_id,
      list_entry: listEntry
    })
  })
}