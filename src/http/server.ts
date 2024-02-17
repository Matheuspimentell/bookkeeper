import fastify from 'fastify'
import { getUsers } from './routes/users/getUsers'
import { findUser } from './routes/users/findUser'
import { createUser } from './routes/users/createUser'
import { updateUser } from './routes/users/updateUser'
import { deleteUser } from './routes/users/deleteUser'

const app = fastify()

app.register(getUsers)
app.register(findUser)
app.register(createUser)
app.register(updateUser)
app.register(deleteUser)
app.listen({port: 3333}).then(() => {
  console.log('HTTP Server is running.')
})