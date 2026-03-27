import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@ekarttrack.com' },
    update: {},
    create: {
      email: 'admin@ekarttrack.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  })
  console.log('Admin user created: admin@ekarttrack.com / admin123')

  // Create karts
  const karts = []
  for (let i = 1; i <= 15; i++) {
    const kart = await prisma.kart.upsert({
      where: { number: i },
      update: {},
      create: {
        number: i,
        name: `Kart #${i}`,
        status: i <= 12 ? 'AVAILABLE' : 'MAINTENANCE',
      },
    })
    karts.push(kart)
  }
  console.log('15 karts created')

  // Create sessions for the next 7 days
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const timeSlots = [
    { start: '10:00', end: '10:10', price: 15000 },
    { start: '10:30', end: '10:40', price: 15000 },
    { start: '11:00', end: '11:10', price: 15000 },
    { start: '11:30', end: '11:40', price: 15000 },
    { start: '14:00', end: '14:10', price: 15000 },
    { start: '14:30', end: '14:40', price: 15000 },
    { start: '15:00', end: '15:10', price: 15000 },
    { start: '15:30', end: '15:40', price: 15000 },
    { start: '16:00', end: '16:10', price: 15000 },
    { start: '17:00', end: '17:10', price: 15000 },
    { start: '18:00', end: '18:10', price: 15000 },
    { start: '19:00', end: '19:10', price: 15000 },
    { start: '20:00', end: '20:10', price: 15000 },
    { start: '21:00', end: '21:10', price: 15000 },
  ]

  for (let d = 0; d < 7; d++) {
    const date = new Date(today)
    date.setDate(date.getDate() + d)

    for (const slot of timeSlots) {
      await prisma.session.create({
        data: {
          date,
          startTime: slot.start,
          endTime: slot.end,
          price: slot.price,
          maxPilots: 10,
          status: 'OPEN',
        },
      })
    }
  }
  console.log('Sessions created for the next 7 days')

  // Create some sample pilots
  const pilots = await Promise.all([
    prisma.pilot.upsert({
      where: { email: 'carlos@test.com' },
      update: {},
      create: { name: 'Carlos Martínez', email: 'carlos@test.com', phone: '+54 11 1234-5678' },
    }),
    prisma.pilot.upsert({
      where: { email: 'lucia@test.com' },
      update: {},
      create: { name: 'Lucía Rodríguez', email: 'lucia@test.com', phone: '+54 11 2345-6789' },
    }),
    prisma.pilot.upsert({
      where: { email: 'martin@test.com' },
      update: {},
      create: { name: 'Martín González', email: 'martin@test.com', phone: '+54 11 3456-7890' },
    }),
  ])
  console.log('Sample pilots created')

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
