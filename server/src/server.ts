import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
  log: ['query'],
});

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  })

  // Contagem de Bolão
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  });

  // Contagem de Usuários
  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()

    return { count }
  });

  // Contagem de Palpites
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  });

  // Criação de Bolão
  fastify.post('/pool', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string()
    })

    const { title } = createPoolBody.parse(request.body);

    const generatorCode = new ShortUniqueId({ length: 6 })
    const code = String(generatorCode()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })

    return reply.status(201).send({ code })
  })

  await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ });
}

start();