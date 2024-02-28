import { FastifyInstance } from 'fastify'
import { authenticateRefresh } from '../../utils/authenticateJwt'
import { signAccess } from '../../utils/signJwt'
import { redis } from '../../lib/redis'
import { z } from 'zod'

export async function refreshToken(app: FastifyInstance) {
  app.post('/token', async (request, reply) => {
    const tokenInformation = z.object({
      token: z.string()
    })

    const { token } = tokenInformation.parse(request.body)
    if(!token) return reply.status(400).send({ message: 'No token detected on request body.' })

    const refreshTokenExists = await redis.sismember('refresh-tokens', token)
    if(!refreshTokenExists) return reply.status(403).send()

    const userData = await authenticateRefresh(token)
    if(!userData) return reply.status(401).send({ message: 'Token not valid.' })

    const accessToken = await signAccess(userData)

    return reply.status(201).send({
      access_token: accessToken,
      refresh_token: token
    })
  })
}