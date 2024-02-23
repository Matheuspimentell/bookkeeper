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

export async function updateListEntry(app: FastifyInstance) {
  app.patch('/users/:username/book-lists/:book_list_id/list-entries/:entry_id', opts,
  async (request, reply) => {
    const listEntryParams = z.object({
      score: z.optional(z.number().int()),
      review: z.optional(z.string()),
    })

    const listEntryInformation = z.object({
      username: z.string().min(6),
      book_list_id: z.number().int(),
      entry_id: z.number().int()
    })

    const { score, review } = listEntryParams.parse(request.body)
    const { username, book_list_id ,entry_id } = listEntryInformation.parse(request.params)

    const listEntry = await prisma.listEntry.update({
      data: {
        score,
        review
      },
      where: {
        id: entry_id,
        AND: {
          bookListId: book_list_id
        }
      }
    }).catch(e => {
      return reply.status(500).send({ message: 'Couldn\'t update list entry information.' })
    })

    return reply.send({
      list_entry: {
        score: listEntry.score,
        review: listEntry.review,
        list_id: listEntry.bookListId
      }
    })
  })
}