import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ParticleBackground from "@/components/features/ParticleBackground";
import { toast } from "sonner";

type AuthMode = "login" | "register" | "forgot";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loginAsGuest } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const update = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "forgot") {
      if (!form.email) { toast.error("Enter your email address"); return; }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      setForgotSent(true);
      setLoading(false);
      return;
    }

    if (mode === "register") {
      if (!form.username || !form.email || !form.password) {
        toast.error("Please fill in all required fields"); return;
      }
      if (form.password.length < 6) {
        toast.error("Password must be at least 6 characters"); return;
      }
      if (form.password !== form.confirm) {
        toast.error("Passwords do not match"); return;
      }
    } else {
      if (!form.email || !form.password) {
        toast.error("Please fill in all required fields"); return;
      }
    }

    setLoading(true);
    
    if (mode === "register") {
      const result = await register(form.username, form.email, form.password);
      if (result.success) {
        // Show verification screen instead of navigating
        setShowVerificationScreen(true);
        setVerificationEmail(form.email);
      } else {
        toast.error(result.error || "Registration failed");
      }
    } else {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.username}! 🚀`);
        navigate("/dashboard");
      } else {
        if (result.needsVerification) {
          // Show verification screen if email is not verified
          setShowVerificationScreen(true);
          setVerificationEmail(result.email);
        } else {
          toast.error(result.error || "Login failed");
        }
      }
    }
    
    setLoading(false);
  };

  const handleGuest = () => {
    loginAsGuest();
    toast.success("Entered as guest — full access unlocked");
    navigate("/courses");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-cyan-500/20 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:bg-white/8 transition-all font-mono text-sm";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 mb-4 glow-box">
            <span className="font-orbitron font-black text-black text-xl">AC</span>
          </div>
          <h1 className="font-orbitron text-3xl font-black text-cyan-400 glow-text tracking-widest">
            ALIEN CODE
          </h1>
          <p className="text-gray-500 text-sm mt-2 tracking-wider">INITIATE NEURAL LINK</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 border border-cyan-500/20">

          {/* ── FORGOT PASSWORD ── */}
          {mode === "forgot" ? (
            <>
              <button
                onClick={() => { setMode("login"); setForgotSent(false); }}
                className="flex items-center gap-1 text-gray-500 text-xs font-orbitron hover:text-cyan-400 transition-colors mb-6"
              >
                ← BACK TO SIGN IN
              </button>

              <h2 className="font-orbitron text-lg font-bold text-white mb-2">RESET PASSWORD</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Enter your email and we'll send a reset link to your inbox.
              </p>

              {forgotSent ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📬</div>
                  <h3 className="font-orbitron text-sm font-bold text-green-400 mb-2">RESET LINK SENT!</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Check your email at <span className="text-cyan-400">{form.email}</span> for instructions to reset your password.
                  </p>
                  <button
                    onClick={() => { setMode("login"); setForgotSent(false); }}
                    className="mt-6 cyber-button-primary cyber-button px-6 py-2.5 rounded-xl font-orbitron text-xs tracking-wider"
                  >
                    BACK TO SIGN IN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-orbitron text-gray-400 tracking-wider mb-2">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="alien@cosmos.io"
                      className={inputClass}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cyber-button-primary cyber-button py-3.5 rounded-xl font-orbitron text-sm tracking-wider mt-2 disabled:opacity-50"
                  >
                    {loading ? "SENDING..." : "SEND RESET LINK →"}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex rounded-xl overflow-hidden border border-cyan-500/20 mb-8">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 font-orbitron text-xs tracking-widest transition-all ${
                      mode === m ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {m === "login" ? "SIGN IN" : "SIGN UP"}
                  </button>
                ))}
              </div>

              {/* Verification Screen */}
              {showVerificationScreen ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📧</div>
                  <h3 className="font-orbitron text-lg font-bold text-cyan-400 mb-2">VERIFY YOUR EMAIL</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    We have sent you a verification email to <span className="text-cyan-400">{verificationEmail}</span>. 
                    Please verify it and log in.
                  </p>
                  <button
                    onClick={() => {
                      setShowVerificationScreen(false);
                      setMode("login");
                    }}
                    className="cyber-button-primary cyber-button px-6 py-3 rounded-xl font-orbitron text-sm tracking-wider"
                  >
                    LOGIN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username — register only */}
                  {mode === "register" && (
                    <div>
                      <label className="block text-xs font-orbitron text-gray-400 tracking-wider mb-2">
                        USERNAME *
                      </label>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => update("username", e.target.value)}
                        placeholder="AlienCoder"
                        className={inputClass}
                        required
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-orbitron text-gray-400 tracking-wider mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="alien@cosmos.io"
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-orbitron text-gray-400 tracking-wider">PASSWORD *</label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-xs text-cyan-500 hover:text-cyan-300 font-orbitron transition-colors"
                        >
                          FORGOT?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        placeholder="••••••••"
                        className={inputClass + " pr-12"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                    {mode === "register" && (
                      <p className="text-gray-600 text-xs mt-1.5 ml-1">Minimum 6 characters</p>
                    )}
                  </div>

                  {/* Confirm password — register only */}
                  {mode === "register" && (
                    <div>
                      <label className="block text-xs font-orbitron text-gray-400 tracking-wider mb-2">
                        CONFIRM PASSWORD *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form.confirm}
                          onChange={(e) => update("confirm", e.target.value)}
                          placeholder="••••••••"
                          className={inputClass + " pr-10"}
                          required
                        />
                        {form.confirm && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                            {form.password === form.confirm ? "✅" : "❌"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Register: terms */}
                  {mode === "register" && (
                    <div className="flex items-start gap-3 pt-1">
                      <input type="checkbox" required className="mt-0.5 accent-cyan-400 cursor-pointer w-4 h-4" />
                      <p className="text-gray-500 text-xs leading-relaxed">
                        I agree to the <span className="text-cyan-500 cursor-pointer hover:text-cyan-300">Terms of Service</span> and{" "}
                        <span className="text-cyan-500 cursor-pointer hover:text-cyan-300">Privacy Policy</span>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cyber-button-primary cyber-button py-3.5 rounded-xl font-orbitron text-sm tracking-wider mt-2 disabled:opacity-50"
                  >
                    {loading
                      ? mode === "login" ? "AUTHENTICATING..." : "CREATING ACCOUNT..."
                      : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-gray-600 text-xs font-orbitron">OR</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {/* Guest */}
              <button
                onClick={handleGuest}
                className="w-full cyber-button py-3.5 rounded-xl font-orbitron text-sm tracking-wider border border-gray-600/50 text-gray-400 hover:text-gray-200 transition-all"
              >
                👽 CONTINUE AS GUEST
              </button>

              <p className="text-center text-gray-600 text-xs mt-4 leading-relaxed">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-cyan-500 hover:text-cyan-300 font-orbitron transition-colors"
                >
                  {mode === "login" ? "SIGN UP" : "SIGN IN"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
