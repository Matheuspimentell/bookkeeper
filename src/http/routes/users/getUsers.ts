import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

// TODO: Make the /users route only available to users that have already authenticated (use JWT)
export async function getUsers(app: FastifyInstance) {
  app.get('/users/:username?', async (request, reply) => {
    const userInformation = z.object({
      username: z.optional(z.string().min(6))
    })

    const { username } = userInformation.parse(request.params)

    if(!username) {
      const users = await prisma.user.findMany({
        select: {
          username: true,
          email: true,
          lists: true
        }
      })
  
      return reply.send({users: users})
    }

    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    return reply.send({ user })
  })
}