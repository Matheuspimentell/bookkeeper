import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../../../utils/authenticateJwt'

const opts = {
  schema: {
    params: {
      username: { type: 'string' },
      book_list_id: { type: 'integer' }
    }
  }
}

export async function createListEntry(app: FastifyInstance) {
  app.post('/users/:username/book-lists/:book_list_id/list-entries', opts, 
  async (request, reply) => {
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }

    const listEntryParams = z.object({
      score: z.optional(z.number().int()),
      review: z.optional(z.string()),
      bookIsbn: z.string().min(6),
    })

    const bookListInformation = z.object({
      username: z.string().min(6),
      book_list_id: z.number().int()
    })

    const { username, book_list_id } = bookListInformation.parse(request.params)
    if(username !== requestUser.username) return reply.status(403).send()

    const { score, review, bookIsbn } = listEntryParams.parse(request.body)

    const book = await prisma.book.findUnique({
      where: {
        isbn: bookIsbn
      }
    })

    if(!book) {
      return reply.status(404).send({ message: 'Book not found on database.' })
    }

    const listEntry = await prisma.listEntry.create({
      data: {
        bookIsbn,
        score,
        review,
        list: {
          connect: {
            id: book_list_id
          }
        }
      }
    })

    if(!listEntry) {
      return reply.status(500).send({ message: 'Couldn\'t create list entry.' })
    }

    return reply.status(201).send({ 
      list_entry: {
        book_list_id: listEntry.bookListId,
        book_isbn: listEntry.bookIsbn,
        score: listEntry.score,
        review: listEntry.review,
      }
    })
  })
}