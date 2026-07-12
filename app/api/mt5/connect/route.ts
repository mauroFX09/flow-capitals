import { NextRequest, NextResponse } from 'next/server'

const METAAPI_URL = 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai'

export async function POST(req: NextRequest) {
  try {
    const { userId, broker, server, login, password } = await req.json()
    if (!userId || !broker || !server || !login || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const token = process.env.METAAPI_TOKEN!

    const res = await fetch(`${METAAPI_URL}/users/current/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
      body: JSON.stringify({
        name: `${broker} ${login}`,
        login: String(login),
        password,
        server,
        platform: 'mt5',
        magic: 123,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: `MetaApi ${res.status}: ${data.message || JSON.stringify(data)}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, accountId: data.id })
  } catch (err: any) {
    return NextResponse.json({ error: `Catch: ${err.message}` }, { status: 500 })
  }
}