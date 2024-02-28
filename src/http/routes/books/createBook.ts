import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { authenticateAccess } from '../../../utils/authenticateJwt'

export async function createBook(app: FastifyInstance) {
  app.post('/books', async (request, reply) => {
    const requestUser = await authenticateAccess(request)
    if(!requestUser) {
      return reply.status(401).send({ message: 'Unauthorized request. Please log in first.' })
    }

    const createBookParams = z.object({
      isbn: z.string().min(10),
      title: z.string().min(3),
      authors: z.array(z.string()).min(1),
      publisher: z.string(),
      publicationYear: z.number().int(),
      genres: z.array(z.string()).min(1)
    })

    const { 
      isbn, title, authors,
      publisher, publicationYear,
      genres 
    } = createBookParams.parse(request.body)

    const book = await prisma.book.create({
      data: {
        isbn,
        publicationYear,
        publisher,
        title,
        authors,
        genres
      }
    })

    if(!book) {
      return reply.status(400).send({ message: 'Couldn\'t create book.' })
    }

    return reply.status(201).send({ book_isbn: book.isbn })
  })
}