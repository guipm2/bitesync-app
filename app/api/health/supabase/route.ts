import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    const nextPublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const nextPublicKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

    const env = {
      SUPABASE_URL: Boolean(supabaseUrl),
      SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
      NEXT_PUBLIC_SUPABASE_URL: Boolean(nextPublicUrl),
      NEXT_PUBLIC_SUPABASE_KEY: Boolean(nextPublicKey),
    }

    let serverClientInit = false
    let userPresent = false
    let authError: string | null = null

    if (supabaseUrl && supabaseAnonKey) {
      const cookieStore = await cookies()
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              /* no-op for route context */
            }
          },
        },
      })
      serverClientInit = true

      const { data, error } = await supabase.auth.getUser()
      userPresent = Boolean(data?.user)
      authError = error?.message ?? null
    }

    return NextResponse.json({
      ok: true,
      env,
      serverClientInit,
      user: { present: userPresent },
      authError,
    })
  } catch (e: unknown) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : "unknown",
    }, { status: 500 })
  }
}
