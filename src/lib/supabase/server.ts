"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client for User interactions (RLS applies)
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignored
          }
        },
        remove(name: string, options: Record<string, any>) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Ignored
          }
        },
      },
    }
  );
}

// Client for Admin/System interactions (Bypasses RLS)
// requires SUPABASE_SERVICE_ROLE_KEY in .env
export async function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.warn("DEBUG: SUPABASE_SERVICE_ROLE_KEY is missing. Admin features (bypass RLS) will fail.");
    return null; // Return null so caller knows it failed
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey, 
    {
      cookies: {
        get(name: string) { return "" },
        set(name: string, value: string, options: Record<string, any>) {},
        remove(name: string, options: Record<string, any>) {},
      },
    }
  );
}
