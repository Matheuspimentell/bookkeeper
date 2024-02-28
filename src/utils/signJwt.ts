import * as jose from 'jose'

export async function signAccess(data: Object) : Promise<string> {
  const secret = new TextEncoder().encode(process.env.SECRET_GEN_KEY)
  const alg = 'HS256'
  const token = await new jose.SignJWT({data})
  .setProtectedHeader({alg})
  .setIssuer('bookeeper-api')
  .setExpirationTime('30s')
  .sign(secret)

  return token
}

export async function signRefresh(data: Object) : Promise<string> {
  const secret = new TextEncoder().encode(process.env.SECRET_REFRESH_KEY)
  const alg = 'HS256'
  const token = await new jose.SignJWT({data})
  .setProtectedHeader({alg})
  .setIssuer('bookeeper-api')
  .sign(secret)

  return token
}