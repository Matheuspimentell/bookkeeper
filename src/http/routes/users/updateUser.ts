import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function updateUser(app: FastifyInstance) {
  app.patch('/users/:id', async (request, reply) => {
    const currentUserParams = z.object({
      id: z.string().uuid()
    })
    
    const updateUserParams = z.object({
      username: z.optional(z.string().min(6)),
      email: z.optional(z.string().email().min(5)),
      password: z.optional(z.string().min(6)),
    })

    const { username, email, password } = updateUserParams.parse(request.body)
    const { id } = currentUserParams.parse(request.params)
    
    let salt: string | undefined
    let hash: string | undefined
    if (password) {
      salt = await bcrypt.genSalt(SALT_ROUNDS)
      hash = await bcrypt.hash(password, salt)
    }

    const user = await prisma.user.update({
      data: {
        username,
        email,
        password: hash,
        salt
      },
      where: {
        id
      }
    })
  
    if (!user) {
      return reply.status(500).send({ message: 'User doesn\'t exist yet.' })
    }

    return reply.send({ message: 'User updated successfully.' })
  })
}