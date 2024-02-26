import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

export async function updateUser(app: FastifyInstance) {
  app.patch('/users/:id', async (request, reply) => {
    const currentUserInformation = z.object({
      id: z.string().uuid()
    })

    const { id } = currentUserInformation.parse(request.params)
    
    const userParams = z.object({
      username: z.optional(z.string().min(6)),
      email: z.optional(z.string().email().min(5)),
      password: z.optional(z.string().min(6)),
    })

    const { username, email, password } = userParams.parse(request.body)
    
    let hash: string | undefined
    if(password) {
      hash = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      data: {
        username,
        email,
        password: hash,
      },
      where: {
        id
      }
    }).catch(e => {
      return reply.status(500).send({ message: 'Couldn\'t update user information.' })
    })

    return reply.send({ user: {
      username: user.username,
      email: user.email
    }})
  })
}