import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSpecificKey() {
  const targetKey = 'bf23ab763305a8ca3c665d5d9806740d6eefdfe8f968e079024b60700300d12f'
  
  console.log('='.repeat(80))
  console.log('ПЕРЕВІРКА API КЛЮЧА')
  console.log('='.repeat(80))
  console.log(`\nКлюч: ${targetKey}\n`)
  
  // Check if key exists
  const apiKey = await prisma.apiKey.findUnique({
    where: { key: targetKey }
  })
  
  if (!apiKey) {
    console.log('❌ КЛЮЧ НЕ ЗНАЙДЕНО В БАЗІ ДАНИХ\n')
    console.log('Цей ключ не існує в системі і не може отримати жодних даних.\n')
    
    // Show all existing keys
    console.log('Існуючі ключі в системі:')
    console.log('-'.repeat(80))
    const allKeys = await prisma.apiKey.findMany()
    allKeys.forEach(key => {
      console.log(`\n${key.type.toUpperCase()} KEY (ID: ${key.id}):`)
      console.log(`  Назва: ${key.name}`)
      console.log(`  Ключ: ${key.key}`)
      console.log(`  Активний: ${key.active}`)
      console.log(`  Створено: ${key.createdAt}`)
    })
  } else {
    console.log('✅ КЛЮЧ ЗНАЙДЕНО!\n')
    console.log(`Тип: ${apiKey.type}`)
    console.log(`Назва: ${apiKey.name}`)
    console.log(`Активний: ${apiKey.active}`)
    console.log(`Створено: ${apiKey.createdAt}`)
    console.log(`Останнє використання: ${apiKey.lastUsedAt || 'Ніколи'}`)
    
    // Show what data this key can access
    if (apiKey.type === 'client') {
      console.log('\n📤 ДОСТУП: Тільки відправка подій')
      console.log('  - Може відправляти app_open події')
      console.log('  - Може відправляти payment події')
      console.log('  - НЕ може читати аналітику')
    } else if (apiKey.type === 'agency') {
      console.log('\n📊 ДОСТУП: Тільки читання аналітики')
      console.log('  - Може отримувати статистику по UTM параметрах')
      console.log('  - НЕ може отримувати персональні дані користувачів')
      console.log('  - НЕ може відправляти події')
      
      // Show available data
      console.log('\n📈 Доступні дані для аналітики:')
      const utmParams = await prisma.appOpen.findMany({
        select: { utmParameter: true },
        distinct: ['utmParameter']
      })
      
      if (utmParams.length > 0) {
        for (const { utmParameter } of utmParams) {
          const uniqueUsers = await prisma.appOpen.count({
            where: { utmParameter }
          })
          const payments = await prisma.payment.findMany({
            where: { utmParameter }
          })
          const payingUsers = new Set(payments.map(p => p.telegramUserId.toString())).size
          const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
          
          console.log(`\n  ${utmParameter}:`)
          console.log(`    Унікальних користувачів: ${uniqueUsers}`)
          console.log(`    Платників: ${payingUsers}`)
          console.log(`    Дохід: ${totalRevenue} Stars`)
        }
      } else {
        console.log('  Поки немає даних')
      }
    }
  }
  
  console.log('\n' + '='.repeat(80))
  await prisma.$disconnect()
}

checkSpecificKey().catch(console.error)

