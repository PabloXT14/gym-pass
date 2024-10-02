import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt) // todas as rotas daqui precisaram de autenticação por token

  app.post('/gyms', create)
}
