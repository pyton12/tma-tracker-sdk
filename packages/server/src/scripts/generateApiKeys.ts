import { randomBytes } from 'crypto'
import { prisma } from '../db/client'

/**
 * Generate a secure API key
 */
function generateApiKey(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Create initial API keys for client and agency
 */
async function generateKeys() {
  try {
    console.log('🔑 Generating API keys...\n')

    // Generate client API key
    const clientKey = generateApiKey()
    await prisma.apiKey.create({
      data: {
        key: clientKey,
        type: 'client',
        name: 'Default Client Key',
        active: true,
      },
    })

    console.log('✅ Client API Key generated:')
    console.log(`   ${clientKey}\n`)

    // Generate agency API key
    const agencyKey = generateApiKey()
    await prisma.apiKey.create({
      data: {
        key: agencyKey,
        type: 'agency',
        name: 'Default Agency Key',
        active: true,
      },
    })

    console.log('✅ Agency API Key generated:')
    console.log(`   ${agencyKey}\n`)

    console.log('💡 Add these keys to your .env file:')
    console.log(`   CLIENT_API_KEY=${clientKey}`)
    console.log(`   AGENCY_API_KEY=${agencyKey}\n`)
  } catch (error) {
    console.error('❌ Error generating API keys:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  generateKeys()
}

export { generateApiKey, generateKeys }
