"use client";

import { CheckCircle2, ShieldCheck, User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Profile {
  full_name?: string | null;
  verified_at?: string | null;
  [key: string]: any;
}

interface VerifiedDashboardProps {
  user: User;
  profile: Profile | null;
}

export function VerifiedDashboard({ user, profile }: VerifiedDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 animate-in fade-in slide-in-from-bottom-8">
      
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-100">
               <ShieldCheck className="w-12 h-12" />
            </div>

            <div className="space-y-2">
               <h1 className="text-2xl font-bold tracking-tight">Identidade Verificada</h1>
               <p className="text-muted-foreground text-sm">
                 Sua verificação biométrica está ativa e válida. Não é necessário realizar o procedimento novamente.
               </p>
            </div>

            <div className="w-full bg-muted/50 rounded-xl p-4 space-y-3">
               <div className="flex items-center gap-3">
                  {user.user_metadata?.avatar_url ? (
                     <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar"/>
                  ) : (
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-500"/>
                     </div>
                  )}
                  <div className="text-left">
                     <p className="font-semibold text-sm">{profile?.full_name || user.email}</p>
                     <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                  </div>
                  <div className="ml-auto">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
               </div>
               
               <div className="h-px bg-border"></div>
               
               <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Verificado em:</span>
                  <span className="font-mono font-medium">
                     {profile?.verified_at 
                        ? new Date(profile.verified_at).toLocaleDateString() 
                        : "Recente"}
                  </span>
               </div>
            </div>

            <form action="/auth/signout" method="post" className="w-full">
                <button className="w-full py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-xl transition-colors">
                    Sair da Conta
                </button>
            </form>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-center text-muted-foreground flex items-center gap-2">
         <ShieldCheck className="w-3 h-3" />
         Protegido por VerifyLive Secure Enclave
      </p>

    </div>
  );
}
