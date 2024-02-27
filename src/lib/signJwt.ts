import * as jose from 'jose'
import { z } from 'zod'

export default async function sign(data: Object) : Promise<string> {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY)
  const alg = 'HS256'
  const token = await new jose.SignJWT({data})
  .setProtectedHeader({alg})
  .setIssuer('bookeeper-api')
  .sign(secret)

  return token
}