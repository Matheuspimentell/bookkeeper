import fastify from 'fastify'
import { getUsers } from './routes/users/getUsers'
import { findUser } from './routes/users/findUser'
import { createUser } from './routes/users/createUser'
import { updateUser } from './routes/users/updateUser'
import { deleteUser } from './routes/users/deleteUser'
import { getBooks } from './routes/books/getBooks'
import { findBook } from './routes/books/findBook'
import { createBook } from './routes/books/createBook'
import { updateBook } from './routes/books/updateBook'
import { deleteBook } from './routes/books/deleteBook'

const app = fastify()

// * Registered routes
app.register(getUsers)       // * GET    /users
app.register(findUser)       // * GET    /users/:username
app.register(createUser)     // * POST   /users
app.register(updateUser)     // * PATCH  /users/:username
app.register(deleteUser)     // * DELETE /users/:username
app.register(getBooks)       // * GET    /books
app.register(findBook)       // * GET    /books/:isbn
app.register(createBook)     // * POST   /books
app.register(updateBook)     // * PATCH  /books/:isbn
app.register(deleteBook)     // * DELETE /books/:isbn

app.listen({port: 3333}).then(() => {
  console.log('HTTP Server is running.')
})