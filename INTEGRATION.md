# 🚀 TMA Tracker SDK - Integration Guide

## 📦 Installation

```bash
npm install tma-tracker-sdk
```

## 🎯 Quick Start

### 1. Initialize SDK

Add this code to your app initialization (e.g., `main.ts`, `app.ts`, or root component):

```typescript
import TMATracks from 'tma-tracker-sdk'

// Initialize on app start
TMATracks.init({
  apiKey: 'bf23ab763305a8ca3c665d5d9806740d6eef',
  apiEndpoint: 'https://tma-trackerserver-production.up.railway.app',
  debug: true // Enable console logs for development
})
  .then(() => {
    console.log('✅ TMA Tracker initialized successfully')
  })
  .catch(error => {
    console.error('❌ TMA Tracker initialization failed:', error)
  })
```

### 2. Track Payments

When user makes a payment, track it:

```typescript
import TMATracks from 'tma-tracker-sdk'

async function handlePayment(amount: number, paymentId: string) {
  try {
    await TMATracks.trackPayment({
      amount: amount,
      paymentId: paymentId
    })
    console.log('✅ Payment tracked successfully')
  } catch (error) {
    console.error('❌ Failed to track payment:', error)
  }
}

// Example usage
await handlePayment(100, 'payment_abc123')
```

### 3. Get UTM Parameter

Get the UTM parameter that user came from:

```typescript
import TMATracks from 'tma-tracker-sdk'

const utm = TMATracks.getUtmParameter()
if (utm) {
  console.log('User came from:', utm)
} else {
  console.log('No UTM parameter found')
}
```

## 📚 Complete API Reference

### `TMATracks.init(config)`

Initialize the SDK. **Must be called before any other methods.**

**Parameters:**
```typescript
interface TMATracksConfig {
  apiKey: string        // Your API key
  apiEndpoint: string   // Tracker server URL
  debug?: boolean       // Enable debug logging (default: false)
  maxRetries?: number   // Max retry attempts (default: 3)
}
```

**Returns:** `Promise<void>`

**Example:**
```typescript
await TMATracks.init({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://your-tracker-server.com',
  debug: process.env.NODE_ENV === 'development',
  maxRetries: 5
})
```

---

### `TMATracks.trackPayment(params)`

Track a payment event.

**Parameters:**
```typescript
interface PaymentParams {
  amount: number      // Payment amount
  paymentId: string   // Unique payment identifier
}
```

**Returns:** `Promise<void>`

**Example:**
```typescript
await TMATracks.trackPayment({
  amount: 99.99,
  paymentId: 'pay_abc123'
})
```

---

### `TMATracks.getUtmParameter()`

Get the current UTM parameter.

**Returns:** `string | null` - UTM parameter or null if not found

**Example:**
```typescript
const utm = TMATracks.getUtmParameter()
if (utm) {
  console.log('User source:', utm)
}
```

---

### `TMATracks.isInitialized()`

Check if SDK is initialized.

**Returns:** `boolean`

**Example:**
```typescript
if (TMATracks.isInitialized()) {
  await TMATracks.trackPayment({ amount: 100, paymentId: 'pay_123' })
} else {
  console.warn('SDK not initialized yet')
}
```

## 🔗 How UTM Tracking Works

1. **Create UTM link:**
   ```
   https://t.me/YourBot/app?startapp=utm_source_123
   ```

2. **SDK automatically:**
   - Extracts `startapp` parameter from Telegram WebApp
   - Decodes base64url if needed
   - Stores UTM parameter
   - Sends app open event on init

3. **Track payments:**
   - Payment events are automatically linked to UTM source
   - View analytics in admin dashboard

## ✅ Benefits vs CDN

| Feature | CDN | NPM Package |
|---------|-----|-------------|
| **CSP Issues** | ❌ Need to whitelist domain | ✅ No issues |
| **Speed** | ❌ Network request | ✅ Bundled |
| **TypeScript** | ❌ Manual types | ✅ Built-in |
| **Tree-shaking** | ❌ Full code | ✅ Only needed |
| **Versioning** | ❌ Manual | ✅ package.json |
| **Offline** | ❌ Doesn't work | ✅ Works |

## 🛠️ TypeScript Support

Full TypeScript support with type definitions:

```typescript
import TMATracks, { 
  TMATracksConfig, 
  PaymentParams 
} from 'tma-tracker-sdk'

const config: TMATracksConfig = {
  apiKey: 'key',
  apiEndpoint: 'https://...',
  debug: true
}

const payment: PaymentParams = {
  amount: 100,
  paymentId: 'pay_123'
}
```

## 📄 Links

- **NPM Package:** https://www.npmjs.com/package/tma-tracker-sdk
- **GitHub:** https://github.com/pyton12/tma-tracker-sdk
- **Admin Dashboard:** https://tma-trackerserver-production.up.railway.app/admin

