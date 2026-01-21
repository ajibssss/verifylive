"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

interface VerificationResult {
  success: boolean;
  details: {
    confidence: number;
    [key: string]: any;
  };
}

export async function completeVerification(result: VerificationResult) {
  // Use Admin Client to ensure we can write to profiles/logs system-wide
  const supabase = (await createAdminClient()) || (await createClient());
  const authClient = await createClient();

  // 1. Get User
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    console.warn("User not authenticated. Skipping 'verifylive_profiles' update. Only logging audit.");
    // For anonymous users, we just log to audit
    await supabase.from("verifylive_audit_logs").insert({
      action: "LIVENESS_COMPLETE",
      status: result.success ? "VERIFIED" : "REJECTED",
      confidence: result.details?.confidence || 0,
      metadata: { ...result.details, anonymous: true },
      ip_address: "unknown", // Could fetch from headers if passed
    });
    return { success: true, saved_profile: false };
  }

  // 2. Upsert Profile (Authenticated)
  const profileUpdates = {
    id: user.id,
    updated_at: new Date().toISOString(),
    is_verified: result.success,
    verified_at: result.success ? new Date().toISOString() : null,
    // Attempt to fill basic info if available from metadata
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    // username is unique, be careful updating it blindly. 
    // If it doesn't exist, we might want to generate one or leave it null for later.
    // simpler to just not touch username if it's already there, or try to insert if new.
  };

  // We use upsert. 
  const { error: profileError } = await supabase
    .from("verifylive_profiles")
    .upsert(profileUpdates, { onConflict: "id" });

  if (profileError) {
    console.error("Profile update failed:", profileError);
    // Don't throw, just log. We still want to save the audit log.
  }

  // 3. Insert Audit Log
  const { error: logError } = await supabase.from("verifylive_audit_logs").insert({
    user_id: user.id,
    action: "LIVENESS_COMPLETE",
    status: result.success ? "VERIFIED" : "REJECTED",
    confidence: result.details?.confidence || 1.0,
    metadata: result.details,
  });

  if (logError) {
    console.error("Audit log failed:", logError);
    throw new Error("Failed to save verification logs.");
  }

  return { success: true, saved_profile: true };
}
