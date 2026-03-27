import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Admin user ──
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@ekarttrack.com' },
    update: {},
    create: { email: 'admin@ekarttrack.com', password: hashedPassword, name: 'Administrador' },
  })
  console.log('Admin: admin@ekarttrack.com / admin123')

  // ── Turn Types ──
  const turnTypes = [
    { name: 'Tanda Libre', description: 'La experiencia perfecta para una primera vez o una tanda rápida.', durationMin: 10, defaultPrice: 15000, maxPilots: 10, color: '#00FF87', sortOrder: 1, features: JSON.stringify(['10 minutos de pista', 'Casco y equipamiento', 'Briefing de seguridad', 'Tiempos por vuelta']) },
    { name: 'Carrera Grupal', description: 'Clasificación + carrera con largada real. La experiencia completa.', durationMin: 15, defaultPrice: 22000, maxPilots: 10, color: '#00D4FF', sortOrder: 2, features: JSON.stringify(['Clasificación 5 min', 'Carrera 10 min', 'Podio y premiación', 'Ranking en pantalla', 'Fotos del evento']) },
    { name: 'VIP Experience', description: 'El paquete premium definitivo. Pista exclusiva y más.', durationMin: 30, defaultPrice: 45000, maxPilots: 6, color: '#B24BF3', sortOrder: 3, features: JSON.stringify(['30 min pista exclusiva', 'Telemetría completa', 'Video onboard', 'Champagne en podio', 'Diploma personalizado', 'Datos de rendimiento']) },
  ]

  for (const tt of turnTypes) {
    await prisma.turnType.upsert({
      where: { name: tt.name },
      update: tt,
      create: tt,
    })
  }
  console.log('Turn types created')

  // ── Business Hours ──
  const hours = [
    { dayOfWeek: 0, isOpen: true, openTime: '10:00', closeTime: '23:00' },  // Domingo
    { dayOfWeek: 1, isOpen: true, openTime: '14:00', closeTime: '22:00' },  // Lunes
    { dayOfWeek: 2, isOpen: true, openTime: '14:00', closeTime: '22:00' },  // Martes
    { dayOfWeek: 3, isOpen: true, openTime: '14:00', closeTime: '22:00' },  // Miércoles
    { dayOfWeek: 4, isOpen: true, openTime: '14:00', closeTime: '22:00' },  // Jueves
    { dayOfWeek: 5, isOpen: true, openTime: '14:00', closeTime: '22:00' },  // Viernes
    { dayOfWeek: 6, isOpen: true, openTime: '10:00', closeTime: '23:00' },  // Sábado
  ]

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: h,
      create: h,
    })
  }
  console.log('Business hours created')

  // ── Site Config ──
  const configs: Record<string, string> = {
    businessName: 'eKartTrack',
    phone: '+54 XXX XXX-XXXX',
    email: 'info@ekarttrack.com',
    address: 'Ruta X Km XX, Ciudad, Provincia',
    whatsappNumber: '54XXXXXXXXXX',
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: '',
    heroTitle: 'SENTÍ LA VELOCIDAD ELÉCTRICA',
    heroSubtitle: 'Pista recreativa de kartings eléctricos. Viví una experiencia de carrera profesional con la tecnología más avanzada en un circuito diseñado para la máxima diversión.',
    trackLength: '500',
    trackCurves: '12',
    trackWidth: '8',
    totalKarts: '15',
    maxSpeed: '80',
    tandaDuration: '10',
  }

  for (const [key, value] of Object.entries(configs)) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
  console.log('Site config created')

  // ── Karts ──
  for (let i = 1; i <= 15; i++) {
    await prisma.kart.upsert({
      where: { number: i },
      update: {},
      create: { number: i, name: `Kart #${i}`, status: i <= 12 ? 'AVAILABLE' : 'MAINTENANCE' },
    })
  }
  console.log('15 karts created')

  // ── Sample sessions for next 7 days ──
  const tandaLibre = await prisma.turnType.findUnique({ where: { name: 'Tanda Libre' } })
  if (tandaLibre) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const slots = [
      { start: '10:00', end: '10:10' }, { start: '10:30', end: '10:40' },
      { start: '11:00', end: '11:10' }, { start: '14:00', end: '14:10' },
      { start: '14:30', end: '14:40' }, { start: '15:00', end: '15:10' },
      { start: '16:00', end: '16:10' }, { start: '17:00', end: '17:10' },
      { start: '18:00', end: '18:10' }, { start: '19:00', end: '19:10' },
      { start: '20:00', end: '20:10' }, { start: '21:00', end: '21:10' },
    ]

    const existingCount = await prisma.session.count()
    if (existingCount === 0) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(today)
        date.setDate(date.getDate() + d)
        for (const slot of slots) {
          await prisma.session.create({
            data: {
              date, startTime: slot.start, endTime: slot.end,
              price: tandaLibre.defaultPrice, maxPilots: tandaLibre.maxPilots,
              status: 'OPEN', turnTypeId: tandaLibre.id,
            },
          })
        }
      }
      console.log('Sessions created for 7 days')
    }
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
