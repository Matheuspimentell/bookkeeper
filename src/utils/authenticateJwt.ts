import * as jose from 'jose'
import { FastifyRequest } from 'fastify'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export async function authenticateAccess(request: FastifyRequest): Promise<Prisma.UserUpdateInput | undefined> {
  const userParams = z.object({
    id: z.string().uuid(),
    username: z.string().min(6),
    email: z.string().min(5),
  })

  const headers = request.headers['authorization']
  const token = headers && headers.split(' ')[1]

  if(!token) return undefined
  
  const secret = new TextEncoder().encode(process.env.SECRET_GEN_KEY)
  
  try {
    const { payload } = await jose.jwtVerify(token, secret)

    const user = userParams.parse(payload)

    return { 
      id: user.id,
      username: user.username,
      email: user.email
    }
  } catch (error) {
    return undefined
  }
}

export async function authenticateRefresh(token: string): Promise<Object | undefined> {
  if(!token) return undefined
  
  const secret = new TextEncoder().encode(process.env.SECRET_REFRESH_KEY)
  const { payload }  = await jose.jwtVerify(token, secret)

  return payload ?? { user: payload }
}