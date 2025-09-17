import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, fullName, cpf, phone, birthDate } = body

  const supabase = await createClient()

  // Sign up user with metadata and phone in auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    phone: phone.replace(/\D/g, ""), // salva telefone no auth para verificação futura
    options: {
      // Não força verificação de email, permite login antes
      data: {
        full_name: fullName,
        cpf: cpf.replace(/\D/g, ""),
        phone: phone.replace(/\D/g, ""),
        birth_date: birthDate,
      },
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Retorna status de verificação do email para controle na interface
  return NextResponse.json({ user: data.user, email_confirmed_at: data.user?.email_confirmed_at })
}
