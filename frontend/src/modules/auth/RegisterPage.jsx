import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleStep1(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register/step1", {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone
      });
      setUserId(res.data.data.userId);
      setStep(2);
    } catch (err) {
      setError("Could not register. Try another email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register/step2", { userId, otp });
      navigate("/login");
    } catch (err) {
      setError("Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {step === 1 ? "Create your account" : "Verify your email"}
        </h1>
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full name</label>
              <input
                className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
                value={form.fullName}
                onChange={e => updateField("fullName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
                value={form.email}
                onChange={e => updateField("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
                value={form.phone}
                onChange={e => updateField("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm"
                value={form.password}
                onChange={e => updateField("password", e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-sm font-medium py-2 rounded-md"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-4">
            <p className="text-sm text-slate-300">
              We sent a 6-digit OTP to <span className="font-semibold">{form.email}</span>.
            </p>
            <div>
              <label className="block text-sm mb-1">OTP</label>
              <input
                className="w-full rounded-md bg-slate-800 border border-slate-600 px-3 py-2 text-sm tracking-widest text-center"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-sm font-medium py-2 rounded-md"
            >
              {loading ? "Verifying..." : "Verify and continue"}
            </button>
          </form>
        )}
        <p className="mt-4 text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
