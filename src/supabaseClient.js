import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './phoneLink.js'

let client = null

export function getSupabase() {
  const config = supabaseConfig()
  if (!config) return null
  if (!client) client = createClient(config.url, config.key)
  return client
}
