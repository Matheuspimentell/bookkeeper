import { FastifyInstance } from 'fastify'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

export async function updateBookList(app: FastifyInstance) {
  app.patch('/users/:username/book-lists', async (request, reply) => {
    const userParams = z.object({
      username: z.string().min(6)
    })

    const booklistParams = z.object({
      title: z.optional(z.string()),
      description: z.optional(z.string())
    })
  })
}