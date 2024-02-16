import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import z from 'zod'

export async function findUser(app: FastifyInstance) {
  app.get('/users/:id', async (request, reply) => {
    const findUserParams = z.object({
      id: z.string().uuid()
    })

    const { id } = findUserParams.parse(request.params)
    
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        lists: true
      }
    })

    if (!user) {
      return reply.status(400).send({ message: 'User not found.' })
    }

    return reply.send(user)
  })
}