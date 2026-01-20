"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function logConsent() {
  const supabase = createClient();
  const headerStore = headers();
  
  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated to accept terms.");
  }

  // 2. Extract Metadata (IP, UA)
  const ip = headerStore.get("x-forwarded-for") || "unknown";
  const userAgent = headerStore.get("user-agent") || "unknown";

  // 3. Insert Audit Log
  const { error } = await supabase
    .from("verifylive_audit_logs")
    .insert({
      user_id: user.id,
      action: "CONSENT_ACCEPTED",
      status: "AGREED",
      confidence: 1.0, // Explicit consent
      ip_address: ip,
      user_agent: userAgent,
      metadata: {
        consent_version: "v1.0", // To track which version of text they saw
        timestamp: new Date().toISOString(),
        legal_basis: "LGPD_CONSENT_BIOMETRIC"
      }
    });

  if (error) {
    console.error("Failed to log consent:", error);
    throw new Error("Failed to persist consent log.");
  }

  return { success: true };
}
