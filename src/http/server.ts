import fastify from "fastify";
import { getUsers } from './routes/getUsers'

const app = fastify()

app.register(getUsers)
app.listen({port: 3333}).then(() => {
  console.log('HTTP Server is running.')
})