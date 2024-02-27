import * as jose from 'jose'
import { FastifyRequest } from 'fastify'

export default async function authenticate(request: FastifyRequest): Promise<Object | undefined> {
  const headers = request.headers['authorization']
  const token = headers && headers.split(' ')[1]

  if(!token) return undefined
  
  const secret = new TextEncoder().encode(process.env.SECRET_KEY)

  const { payload }  = await jose.jwtVerify(token, secret)

  return payload ?? { user: payload }
}