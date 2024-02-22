import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'

// TODO: Make the /users route only available to users that have already authenticated (use JWT)
export async function getUsers(app: FastifyInstance) {
  app.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        lists: true
      }
    })

    return reply.send({users: users})
  })
}