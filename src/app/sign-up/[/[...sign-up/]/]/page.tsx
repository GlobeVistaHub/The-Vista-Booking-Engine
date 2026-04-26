import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-v-background flex items-center justify-center p-6 py-32">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-navy/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold text-navy mb-3 tracking-tight">THE VISTA</h1>
          <p className="text-muted text-sm font-medium uppercase tracking-[0.2em]">Join the Collection</p>
        </div>

        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto shadow-2xl rounded-3xl overflow-hidden border border-navy/5",
              card: "bg-white p-8",
              headerTitle: "text-2xl font-bold text-navy",
              headerSubtitle: "text-muted",
              socialButtonsBlockButton: "border-navy/10 hover:bg-navy/5 transition-all rounded-xl",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white rounded-xl py-3 shadow-md transition-all",
              formFieldInput: "rounded-xl border-navy/10 focus:border-primary focus:ring-primary/20",
              footerActionLink: "text-primary hover:text-primary/80 font-bold"
            }
          }}
        />
      </div>
    </div>
  );
}
