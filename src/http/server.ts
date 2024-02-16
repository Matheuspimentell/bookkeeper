import fastify from "fastify";
import { getUsers } from './routes/getUsers'
import { findUser } from './routes/findUser'
import { createUser } from './routes/createUser'

const app = fastify()

app.register(getUsers)
app.register(findUser)
app.register(createUser)
app.listen({port: 3333}).then(() => {
  console.log('HTTP Server is running.')
})