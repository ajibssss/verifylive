import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      {/* Background Gradient & Solid Base */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/90 to-transparent -z-10" />
      {/* Extended solid black base to ensure full coverage behind footer text */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black -z-20" />

      {/* Content Container - Aligned with Navbar (px-6, w-full, no max-width container) */}
      <div className="w-full h-32 px-6 pb-6 relative flex items-end">
        
        {/* Left: ASCII Logo (Global absolute left alignment) */}
        {/* Size reduced by ~25%: text-[4px] (mobile) / text-[6px] (desktop) */}
        <div className="absolute bottom-6 left-6 pointer-events-auto">
          <a href="https://artificialuniverse.tech/p/aiexxplorer" target="_blank" className="block group">
              <table className="border-collapse">
                <tbody>
                  <tr>
                    <td className="text-left p-0">
                      <pre 
                        className="text-[3px] md:text-[6px] leading-none whitespace-pre select-none overflow-hidden text-white group-hover:text-blue-400 transition-colors duration-300"
                        style={{ 
                          fontFamily: '"Consolas", "Monaco", "Menlo", "Courier New", monospace',
                          letterSpacing: '0px',
                          fontVariantLigatures: 'none'
                        }}
                      >
{`  █████╗ ██╗███████╗██╗  ██╗██╗  ██╗
   ██╔══██╗██║██╔════╝╚██╗██╔╝╚██╗██╔╝
   ███████║██║█████╗   ╚███╔╝  ╚███╔╝
   ██╔══██║██║██╔══╝   ██╔██╗  ██╔██╗
   ██║  ██║██║███████╗██╔╝ ██╗██╔╝ ██╗
   ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`}
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>
          </a>
        </div>

        {/* Center/Right: Copyright */}
        {/* Mobile: Absolute Right to avoid overlap */}
        <div className="md:hidden absolute bottom-6 right-6 text-right pointer-events-auto">
             <p className="text-[10px] text-muted-foreground font-mono leading-tight">
                © {new Date().getFullYear()} Artificial Universe.<br />All Rights Reserved.
             </p>
        </div>
        {/* Desktop: Absolute Center */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-6 text-center pointer-events-auto">
             <p className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                © {new Date().getFullYear()} Artificial Universe. All Rights Reserved.
             </p>
        </div>

        {/* Right: Desktop Navigation & Icons (Absolute Right aligned with Navbar User/Login) */}
        <div className="hidden md:flex absolute bottom-4 right-6 flex-col items-center gap-3 pointer-events-auto">
            
            {/* Legal Row */}
            <div className="flex items-center gap-6">
                <a href="/legal/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos</a>
                <a href="/legal/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
                <a href="/legal/refund" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Reembolso</a>
                <a href="/trust" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trust Center</a>
            </div>

            {/* Connect Icons Row - Centered relative to Legal Row */}
            <div className="flex items-center justify-center gap-4">
                <a href="https://github.com/Artificial-Universe" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                    <Github size={16} />
                </a>
                <a href="https://discord.gg/2QE8NyJr" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/artificialuniverse/" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                    <Linkedin size={16} />
                </a>
                <a href="https://huggingface.co/ArtificialUniverse" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                    <span className="text-base leading-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">🤗</span>
                </a>
            </div>

        </div>

      </div>
    </footer>
  )
}
