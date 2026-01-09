# @tma-tracker/client

**Client SDK for TMA Tracker** - Track user acquisition and payments in Telegram Mini Apps with UTM parameters.

## 🚀 Installation

```bash
npm install @tma-tracker/client
```

## 📖 Quick Start

### 1. Initialize SDK

```typescript
import TMATracks from '@tma-tracker/client'

// Initialize on app start
TMATracks.init({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://your-tracker-server.com',
  debug: true // Enable console logs
})
```

### 2. Track Payments

```typescript
// Track when user makes a payment
await TMATracks.trackPayment({
  amount: 100,
  paymentId: 'payment_123'
})
```

### 3. Get UTM Parameter

```typescript
// Get current UTM parameter
const utm = TMATracks.getUtmParameter()
console.log('User came from:', utm)
```

## 🎯 Features

- ✅ **Automatic app open tracking** - Tracks when users open your app via UTM links
- ✅ **Payment tracking** - Track revenue and attribute it to UTM sources
- ✅ **Telegram user detection** - Automatically extracts user info from Telegram WebApp
- ✅ **UTM parameter extraction** - Decodes base64url UTM from `startapp` parameter
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Lightweight** - ~3KB minified + gzipped
- ✅ **No dependencies** - Works standalone

## 📚 API Reference

### `TMATracks.init(config)`

Initialize the SDK. Must be called before any other methods.

**Parameters:**
- `config.apiKey` (string, required) - Your API key
- `config.apiEndpoint` (string, required) - Your tracker server URL
- `config.debug` (boolean, optional) - Enable debug logging (default: false)
- `config.maxRetries` (number, optional) - Max retry attempts for failed requests (default: 3)

**Returns:** `Promise<void>`

**Example:**
```typescript
await TMATracks.init({
  apiKey: 'your-api-key',
  apiEndpoint: 'https://tracker.example.com',
  debug: process.env.NODE_ENV === 'development'
})
```

### `TMATracks.trackPayment(params)`

Track a payment event.

**Parameters:**
- `params.amount` (number, required) - Payment amount
- `params.paymentId` (string, required) - Unique payment identifier

**Returns:** `Promise<void>`

**Example:**
```typescript
await TMATracks.trackPayment({
  amount: 99.99,
  paymentId: 'pay_abc123'
})
```

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

### `TMATracks.isInitialized()`

Check if SDK is initialized.

**Returns:** `boolean`

**Example:**
```typescript
if (TMATracks.isInitialized()) {
  await TMATracks.trackPayment({ amount: 100, paymentId: 'pay_123' })
}
```

## 🔗 How UTM Tracking Works

1. **Create UTM link:**
   ```
   https://t.me/YourBot/app?startapp=utm_source_123
   ```

2. **SDK extracts UTM:**
   - Reads `startapp` parameter from Telegram WebApp
   - Decodes base64url if needed
   - Stores UTM parameter

3. **Automatic tracking:**
   - App open event sent automatically on init
   - Payment events linked to UTM source

## 🛠️ TypeScript

Full TypeScript support with type definitions:

```typescript
import TMATracks, { TMATracksConfig, PaymentParams } from '@tma-tracker/client'

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

## 📦 Bundle Formats

- **ESM:** `dist/index.esm.js` - For modern bundlers (Vite, Webpack 5+)
- **CommonJS:** `dist/index.js` - For Node.js and older bundlers
- **UMD:** `dist/index.umd.js` - For CDN usage (browser global)

## 🌐 CDN Usage (Alternative)

If you prefer CDN over npm:

```html
<script src="https://your-tracker-server.com/sdk/tma-tracker.min.js"></script>
<script>
  TMATracks.init({
    apiKey: 'your-key',
    apiEndpoint: 'https://your-tracker-server.com'
  })
</script>
```

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/pyton12/tma-tracker-sdk)
- [Report Issues](https://github.com/pyton12/tma-tracker-sdk/issues)

