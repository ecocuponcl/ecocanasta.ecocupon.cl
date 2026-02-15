"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Variable para almacenar la instancia única del cliente
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      // Usar un storage key único para evitar conflictos
      storageKey: "ecocupon-supabase-auth",
    },
  })
}

export function getSupabaseBrowserClient() {
  // Si el cliente ya existe, devolver la instancia existente
  if (!supabaseClient) {
    supabaseClient = createBrowserClient()
  }
  return supabaseClient
}
