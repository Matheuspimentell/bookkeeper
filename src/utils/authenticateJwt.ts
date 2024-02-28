import * as jose from 'jose'
import { FastifyRequest } from 'fastify'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export async function authenticateAccess(request: FastifyRequest): Promise<Prisma.UserUpdateInput | undefined> {
  const payloadParams = z.object({
    data: z.object({
      id: z.string().uuid(),
      username: z.string().min(6),
      email: z.string().min(5)
    }),
    iss: z.string(),
    exp: z.number()
  })
  
  const headers = request.headers['authorization']
  const token = headers && headers.split(' ')[1]

  if(!token) return undefined
  
  const secret = new TextEncoder().encode(process.env.SECRET_GEN_KEY)
  
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    
    const { data, iss, exp } = payloadParams.parse(payload)

    if(iss !== 'bookeeper-api') return undefined

    return data ?? data
  } catch (error) {
    return undefined
  }
}

export async function authenticateRefresh(token: string): Promise<Object | undefined> {  
  if(!token) return undefined

  const payloadParams = z.object({
    data: z.object({
      id: z.string().uuid(),
      username: z.string().min(6),
      email: z.string().min(5)
    }),
    iss: z.string(),
  })
  
  const secret = new TextEncoder().encode(process.env.SECRET_REFRESH_KEY)
  const { payload }  = await jose.jwtVerify(token, secret)
  const { data, iss } = payloadParams.parse(payload)
  
  if(iss !== 'bookeeper-api') return undefined

  return data ?? data
}