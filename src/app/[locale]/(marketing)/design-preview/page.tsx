import React from "react";
import { ArrowRight, ShieldCheck, Clock, Globe, FileText, Check, AlertCircle } from "lucide-react";

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* --- Top Trust Bar --- */}
      <div className="bg-[#1E293B] text-white py-2 px-6 text-[11px] font-medium flex justify-center items-center gap-4 tracking-wide uppercase">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          Secure 256-bit Encryption
        </span>
        <span className="w-px h-3 bg-slate-700"></span>
        <span className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-blue-400" />
          Official Fiscal Representation Service
        </span>
      </div>

      {/* --- Navbar --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0F172A] flex items-center justify-center rounded text-white font-bold text-xl">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-[#0F172A]">GetNIF</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Portugal</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Service Overview</a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Compliance Guide</a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Support</a>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded shadow-sm transition-all active:transform active:scale-95">
            START APPLICATION
          </button>
        </div>
      </nav>

      {/* --- Hero Section with Floating Content --- */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200 bg-white">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-[-12deg] translate-x-1/4 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1fr_440px] gap-16 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-6">
                Official Compliance Gateway 2026
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-[1.15] mb-6">
                Obtain Your Portuguese NIF <br /> 
                <span className="text-blue-600">Securely and Remotely.</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                The Essential First Step for Living, Working, or Investing in Portugal. 
                Full fiscal representation and automated compliance roadmap included.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded flex items-center gap-3 transition-colors shadow-lg shadow-blue-600/20">
                  APPLY FOR NIF NOW
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-4 px-8 rounded transition-colors">
                  VIEW REQUIREMENTS
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-bold text-[#0F172A]">15,000+</span> 
                  <span className="text-slate-500 ml-1">applicants processed this year</span>
                </div>
              </div>
            </div>

            {/* --- The "Floating Form" Inspired Tracker --- */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xl p-8 relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 tracking-tight">Application Progress</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Real-time status</span>
              </div>

              <div className="space-y-6">
                {[
                  { title: "NIF Request", desc: "Digital application submission", status: "completed" },
                  { title: "Document Verification", desc: "Identity & Address proof review", status: "active" },
                  { title: "Fiscal Representation", desc: "Local appointee assignment", status: "pending" },
                  { title: "NIF Final Issue", desc: "Delivery of official document", status: "pending" },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative">
                    {idx < 3 && (
                      <div className={`absolute left-[13px] top-8 w-px h-8 ${step.status === 'completed' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    )}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.status === 'completed' ? 'bg-blue-600 text-white' : 
                      step.status === 'active' ? 'bg-white border-2 border-blue-600 text-blue-600' : 
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {step.status === 'completed' ? <Check className="w-4 h-4" /> : <span className="text-[11px] font-bold">{idx + 1}</span>}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  Est: 3-5 Business Days
                </div>
                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 uppercase">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></div>
                  Live Service
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Service Cards Section --- */}
      <section className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Comprehensive EU Compliance</h2>
            <p className="text-slate-600 max-w-2xl">The NIF is required before opening a bank account, renting property, or registering for social security. We ensure your transition is legally compliant.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">NIF Issuance</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">Remote procurement of your Portuguese Tax Identification Number. Mandatory for all administrative actions in Portugal.</p>
              <div className="pt-4 border-t border-slate-50 flex items-center text-xs font-bold text-blue-600 cursor-pointer hover:gap-2 transition-all">
                LEARN MORE <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded mb-6">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">CRUE Certificate</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">EU Citizens must register after 90 days. Failure to register within 30 days of the window results in significant fines.</p>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-tight">Must be done at <strong>Câmara Municipal</strong>. AIMA registration is only for non-EU nationals.</p>
              </div>
            </div>

            <div className="bg-white p-8 border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 flex items-center justify-center rounded mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">NISS & SNS</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">Social Security (NISS) and Healthcare (SNS) registration. These steps require your NIF and CRUE to be completed first.</p>
              <div className="pt-4 border-t border-slate-50 flex items-center text-xs font-bold text-blue-600 cursor-pointer hover:gap-2 transition-all">
                VIEW TIMELINE <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for Images section */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           <div className="image-placeholder aspect-video rounded border-slate-200 bg-slate-50">
              <div className="image-placeholder-label">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">OFFICE CONTEXT</p>
                <p className="text-slate-500">High-quality photograph of a professional office environment in Lisbon. Clean desks, large windows, bright professional lighting.</p>
              </div>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Dedicated Support Throughout Your Move</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">Our legal experts and fiscal representatives ensure that every document is verified before submission to the Portuguese Tax Authority (Finanças).</p>
              <ul className="space-y-4">
                {[
                  "Document pre-review within 24 hours",
                  "Direct communication with fiscal reps",
                  "Automated status notifications",
                  "Secure digital document vault"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0F172A] text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 bg-white text-[#0F172A] flex items-center justify-center rounded font-bold text-sm">P</div>
              <span className="font-bold text-white text-lg">GetNIF</span>
            </div>
            <p className="text-xs leading-relaxed">Specialized in Portuguese fiscal representation and relocation compliance for EU and non-EU citizens.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Services</h4>
            <ul className="space-y-4 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">NIF for EU Citizens</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NIF for non-EU Residents</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fiscal Representation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bank Account Intro</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Compliance</h4>
            <ul className="space-y-4 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">CRUE Registry</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NISS Social Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SNS Health System</a></li>
              <li><a href="#" className="hover:text-white transition-colors">IFICI Tax Regime</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4 text-xs font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-[10px] uppercase tracking-widest font-bold flex justify-between items-center">
          <p>© 2026 GetNIFPortugal. Private service, not a government agency.</p>
          <p>Made with security in mind.</p>
        </div>
      </footer>
    </div>
  );
}
