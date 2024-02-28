import fastify from 'fastify'
import { getUsers } from './routes/users/getUsers'
import { createUser } from './routes/users/createUser'
import { updateUser } from './routes/users/updateUser'
import { deleteUser } from './routes/users/deleteUser'
import { getBooks } from './routes/books/getBooks'
import { createBook } from './routes/books/createBook'
import { updateBook } from './routes/books/updateBook'
import { deleteBook } from './routes/books/deleteBook'
import { createBookList } from './routes/users/booklists/createBookList'
import { deleteBookList } from './routes/users/booklists/deleteBookList'
import { getBookLists } from './routes/users/booklists/getBookLists'
import { updateBookList } from './routes/users/booklists/updateBookList'
import { createListEntry } from './routes/users/booklists/list entries/createListEntry'
import { deleteListEntry } from './routes/users/booklists/list entries/deleteListEntry'
import { getListEntries } from './routes/users/booklists/list entries/getListEntries'
import { updateListEntry } from './routes/users/booklists/list entries/updateListEntry'
import { login } from './routes/users/login'
import { refreshToken } from './routes/refreshToken'

const app = fastify()

// * Registered routes
app.register(getUsers)         // * GET     /users/:username?
app.register(createUser)       // * POST    /users
app.register(updateUser)       // * PATCH   /users/:username
app.register(deleteUser)       // * DELETE  /users/:username
app.register(login)            // * POST    /users/login
app.register(refreshToken)     // * POST    /token
app.register(getBooks)         // * GET     /books/:isbn?
app.register(createBook)       // * POST    /books
app.register(updateBook)       // * PATCH   /books/:isbn
app.register(deleteBook)       // * DELETE  /books/:isbn
app.register(createBookList)   // * POST    /users/:username/book-lists
app.register(deleteBookList)   // * DELETE  /users/:username/book-lists/:list_id
app.register(getBookLists)     // * GET     /users/:username/book-lists/:list_id?
app.register(updateBookList)   // * PATCH   /users/:username/book-lists/:list_id
app.register(createListEntry)  // * POST    /users/:username/book-lists/:list_id/list-entries
app.register(deleteListEntry)  // * DELETE  /users/:username/book-lists/:id/list-entries/:entry_id
app.register(getListEntries)   // * GET     /users/:username/book-lists/:id/list-entries/:entry_id?
app.register(updateListEntry)  // * PATCH   /users/:username/book-lists/:id/list-entries/:entry_id

app.listen({port: 3333}).then(() => {
  console.log('HTTP Server is running.')
})