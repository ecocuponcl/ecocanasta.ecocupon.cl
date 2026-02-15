import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// No necesitamos un singleton en el servidor ya que cada solicitud
// crea su propio contexto, pero mantenemos la consistencia en la configuración
export function createServerClient() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables")
    }

    return createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            // Usar un storage key único para evitar conflictos
            storageKey: "ecocupon-supabase-auth",
        },
    })
}
