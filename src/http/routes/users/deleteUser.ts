import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function deleteUser(app: FastifyInstance) {
  app.delete('/users/:id', async (request, reply) => {
    const userInformation = z.object({
      id: z.string().uuid()
    })

    const { id } = userInformation.parse(request.params)

    const user = await prisma.user.delete({
      where: {
        id
      }
    })

    if(!user) {
      return reply.status(404).send({ message: 'Couldn\'t delete user information.' })
    }

    return reply.status(204).send()
  })
}