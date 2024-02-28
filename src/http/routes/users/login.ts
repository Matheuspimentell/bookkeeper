import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { signAccess, signRefresh } from '../../../utils/signJwt'
import { redis } from '../../../lib/redis'

export async function login(app: FastifyInstance) {
  app.post('/users/login', async (request, reply) => {
    const userInformation = z.object({
      username: z.string().min(6),
      password: z.string().min(6)
    })

    const { username, password } = userInformation.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if(!user) {
      return reply.status(404).send({ message: 'User not found.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
      return reply.status(400).send({ message: 'Invalid username or password.' })
    }

    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    const accessToken = await signAccess(tokenData)
    const refreshToken = await signRefresh(tokenData)

    const tokens = await redis.sadd('refresh-tokens', refreshToken)

    console.log(tokens)

    return reply.send({ 
      access_token: accessToken,
      refresh_token: refreshToken
    })
  })
}