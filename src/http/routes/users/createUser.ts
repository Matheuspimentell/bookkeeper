import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function createUser(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const userParams = z.object({
      username: z.string().min(6),
      email: z.string().email().min(5),
      password: z.string().min(6),
    })

    const { username, email, password } = userParams.parse(request.body)

    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        salt
      }
    })

    if(!user) {
      return reply.status(500).send({ message: "Couldn\'t create user." })
    }

    return reply.status(201).send({ user_id: user.id })
  })
}