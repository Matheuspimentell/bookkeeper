import { FastifyInstance } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import * as jose from 'jose'
import { env } from 'process'

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
      return reply.status(400).send({ message: 'Invalid username or password' })
    }
    
    const encodedSecretKey = new TextEncoder().encode(
      process.env.SECRET_KEY && process.env.SECRET_KEY
    )
    
    if(!encodedSecretKey) {
      return reply.status(500).send({ message: 'No secret key found.' })
    }

    const jwt = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      username: user.username 
    }).setProtectedHeader({ alg: "HS256" }).sign(encodedSecretKey)

    return reply.send({ token: jwt })
  })
}