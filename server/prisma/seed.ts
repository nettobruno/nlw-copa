import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Bruno Netto',
      email: 'brunonettomac@outlook.com',
      avatarUrl: 'https://github.com/nettobruno.png'
    }
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemplo de bolão',
      code: 'bol123',
      ownerId: user.id,

      participant: {
        create: {
          userId: user.id
        }
      }
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-02T20:24:02.602Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-03T20:24:02.602Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 0,
          
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  });
}

main();