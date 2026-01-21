"use client";

import { ShieldCheck, Lock, Clock, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ComplianceModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ComplianceModal({ onAccept, onDecline }: ComplianceModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10 rounded-t-2xl">
          <div className="flex items-center gap-3 text-primary">
             <ShieldCheck className="w-8 h-8" />
             <h2 className="text-xl font-bold">Verificação de Identidade Segura</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar pb-32">
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3">
             <div className="mt-1">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
             </div>
             <div className="text-sm text-blue-300 space-y-1">
               <p>
                 Em conformidade com a:
               </p>
               <ul className="list-disc pl-4 space-y-1">
                 <li>
                   <a 
                     href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="underline hover:text-blue-200 inline-flex items-center gap-1"
                   >
                     Lei Geral de Proteção de Dados (LGPD) <ExternalLink size={10} />
                   </a>
                 </li>
                 <li>
                   <a 
                     href="http://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14063.htm" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="underline hover:text-blue-200 inline-flex items-center gap-1"
                   >
                     Lei 14.063 (Assinatura Eletrônica) <ExternalLink size={10} />
                   </a>
                 </li>
                 <li>
                   <a 
                     href="http://www.planalto.gov.br/ccivil_03/leis/l8069.htm" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="underline hover:text-blue-200 inline-flex items-center gap-1"
                   >
                     Lei Felca / ECA (Proteção Digital do Menor) <ExternalLink size={10} />
                   </a>
                 </li>
               </ul>
             </div>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">
            Para garantir a segurança do processo, prevenir fraudes de identidade e proteger menores de idade, precisamos coletar:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border p-4 rounded-xl space-y-2">
              <div className="bg-emerald-500/10 w-fit p-2 rounded-lg text-emerald-500">
                 <Lock size={20} />
              </div>
              <h3 className="font-semibold text-sm">Criptografia de Ponta</h3>
              <p className="text-xs text-muted-foreground">
                Seus dados trafegam por canais seguros (TLS 1.3) e são armazenados criptografados.
              </p>
            </div>

            <div className="border border-border p-4 rounded-xl space-y-2">
              <div className="bg-amber-500/10 w-fit p-2 rounded-lg text-amber-500">
                 <Clock size={20} />
              </div>
              <h3 className="font-semibold text-sm">TTL de 24 Horas</h3>
              <p className="text-xs text-muted-foreground">
                Imagens e dados temporários são excluídos automaticamente após a verificação.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg border border-border">
            <p className="font-semibold">Bases Legais Detalhadas:</p>
            <ul className="list-disc pl-4 space-y-1">
               <li>
                   <a href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art7" target="_blank" className="hover:underline">
                      Art. 7º, inc. II, LGPD (Cumprimento de obrigação legal)
                   </a>
               </li>
               <li>
                   <a href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm#art11" target="_blank" className="hover:underline">
                      Art. 11, inc. II, alínea &apos;g&apos;, LGPD (Prevenção à fraude)
                   </a>
               </li>
               <li>
                   <a href="http://www.planalto.gov.br/ccivil_03/leis/l8069.htm" target="_blank" className="hover:underline">
                      ECA/Lei Felca (Proteção contra exposição e adultização precoce)
                   </a>
               </li>
            </ul>
          </div>
          
        </div>

        {/* Footer (Fixed inside modal) */}
        <div className="p-6 border-t border-border bg-muted/50 flex gap-3 justify-end sticky bottom-0 rounded-b-2xl">
          <button 
            onClick={onDecline}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Não aceito
          </button>
          <button 
            onClick={() => { setIsOpen(false); onAccept(); }}
            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Concordar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
