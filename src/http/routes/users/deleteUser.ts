import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function deleteUser(app: FastifyInstance) {
  app.delete('/users/:id', async (request, reply) => {
    const userParams = z.object({
      id: z.string().uuid()
    })

    const { id } = userParams.parse(request.params)

    const user = await prisma.user.delete({
      where: {
        id
      }
    })

    if (!user) {
      return reply.status(500).send({ message: 'Couldn\'t delete user information.' })
    }

    return reply.send({ message: 'User deleted successfully.' })
  })
}