import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToker',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(userRoutes)
app.register(checkInRoutes)
app.register(gymsRoutes)
app.register(fastifyCookie)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO
  }
  return reply.status(500).send({ message: 'Internal error' })
})
