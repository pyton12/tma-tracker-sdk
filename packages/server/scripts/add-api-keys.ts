import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const clientKey = process.env.CLIENT_API_KEY
  const agencyKey = process.env.AGENCY_API_KEY

  if (!clientKey || !agencyKey) {
    console.error('❌ Error: CLIENT_API_KEY and AGENCY_API_KEY must be set in environment variables')
    process.exit(1)
  }

  console.log('🔑 Adding API keys to database...\n')

  // Add client key
  const client = await prisma.apiKey.upsert({
    where: { key: clientKey },
    update: {
      active: true,
      name: 'Client SDK Key',
      type: 'client',
    },
    create: {
      key: clientKey,
      type: 'client',
      name: 'Client SDK Key',
      active: true,
    },
  })

  console.log('✅ Client API Key added:')
  console.log(`   ID: ${client.id}`)
  console.log(`   Type: ${client.type}`)
  console.log(`   Key: ${clientKey.substring(0, 10)}...`)
  console.log(`   Active: ${client.active}\n`)

  // Add agency key
  const agency = await prisma.apiKey.upsert({
    where: { key: agencyKey },
    update: {
      active: true,
      name: 'Agency Dashboard Key',
      type: 'agency',
    },
    create: {
      key: agencyKey,
      type: 'agency',
      name: 'Agency Dashboard Key',
      active: true,
    },
  })

  console.log('✅ Agency API Key added:')
  console.log(`   ID: ${agency.id}`)
  console.log(`   Type: ${agency.type}`)
  console.log(`   Key: ${agencyKey.substring(0, 10)}...`)
  console.log(`   Active: ${agency.active}\n`)

  console.log('🎉 API keys successfully added to database!')
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

