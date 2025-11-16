import { NextRequest, NextResponse } from 'next/server'

// Demo webhook endpoint - Stripe integration disabled

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    received: true,
    demo: true,
    message: 'Stripe webhook disabled - demo mode'
  })
}
