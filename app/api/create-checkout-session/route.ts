import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, userEmail } = await request.json()

    if (!plan || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Return demo response - actual Stripe integration disabled
    // Payment modal is UI only (demo mode)
    return NextResponse.json({ 
      url: '/dashboard?demo=true&plan=' + plan,
      demo: true,
      message: 'Payment integration disabled - using demo mode'
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
