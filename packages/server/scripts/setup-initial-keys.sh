#!/bin/bash

# Script to setup initial API keys using Admin API
# Usage: ./setup-initial-keys.sh <API_URL> <ADMIN_SECRET>

API_URL=${1:-"http://localhost:3000"}
ADMIN_SECRET=${2:-""}

if [ -z "$ADMIN_SECRET" ]; then
  echo "❌ Error: ADMIN_SECRET is required"
  echo "Usage: ./setup-initial-keys.sh <API_URL> <ADMIN_SECRET>"
  echo "Example: ./setup-initial-keys.sh https://your-app.railway.app your_admin_secret"
  exit 1
fi

echo "🔑 Setting up initial API keys..."
echo "📡 API URL: $API_URL"
echo ""

# Generate Client API Key
echo "📱 Generating Client API Key..."
CLIENT_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/admin/keys/generate" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "client", "name": "Client SDK Key"}')

CLIENT_KEY=$(echo $CLIENT_RESPONSE | grep -o '"key":"[^"]*' | cut -d'"' -f4)

if [ -z "$CLIENT_KEY" ]; then
  echo "❌ Failed to generate client key"
  echo "Response: $CLIENT_RESPONSE"
  exit 1
fi

echo "✅ Client API Key: $CLIENT_KEY"
echo ""

# Generate Agency API Key
echo "🏢 Generating Agency API Key..."
AGENCY_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/admin/keys/generate" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type": "agency", "name": "Agency Analytics Key"}')

AGENCY_KEY=$(echo $AGENCY_RESPONSE | grep -o '"key":"[^"]*' | cut -d'"' -f4)

if [ -z "$AGENCY_KEY" ]; then
  echo "❌ Failed to generate agency key"
  echo "Response: $AGENCY_RESPONSE"
  exit 1
fi

echo "✅ Agency API Key: $AGENCY_KEY"
echo ""

# Display summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Initial API keys created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Add these to your Railway environment variables:"
echo ""
echo "CLIENT_API_KEY=$CLIENT_KEY"
echo "AGENCY_API_KEY=$AGENCY_KEY"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

