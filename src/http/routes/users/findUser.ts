import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import z from 'zod'

export async function findUser(app: FastifyInstance) {
  app.get('/users/:username', async (request, reply) => {
    const userInformation = z.object({
      username: z.string().min(6)
    })

    const { username } = userInformation.parse(request.params)
    
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        lists: true
      }
    })

    if(!user) {
      return reply.status(404).send({ message: 'User not found.' })
    }

    return reply.send({
      user: {
        username: user.username,
        email: user.email,
        lists: user.lists
      }
    })
  })
}