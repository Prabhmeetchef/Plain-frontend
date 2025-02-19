"use client";
import { Alumni_Sans } from "next/font/google";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const alumni = Alumni_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState({ normal: false, google: false });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, normal: true }));

    try {
      const signUpResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!signUpResponse.ok) throw new Error("Signup failed");

      const signInResponse = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResponse?.error) throw new Error(signInResponse.error);

      router.push("/dashboard/components");
    } catch (error) {
      console.error("Error during signup/signin:", error);
      alert("Signup or signin failed. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, normal: false }));
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, google: true }));

    try {
      await signIn("google", {
        callbackUrl: "/dashboard/components",
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  return (
    <div className={`flex justify-center w-[100vw] h-[100vh] ${alumni.className}`}>
      <div className="sm:w-[50vw] flex flex-col items-center h-[100vh] w-[80vw]">
        <Link href="/">
          <Image src="/Logo.png" alt="Logo" width={120} height={80} className="pt-[65px]" />
        </Link>
        <h1 className="text-black text-[40px] font-bold block pt-12">Hey There!</h1>
        <h2 className="text-[#949494] text-[26px] font-semibold block">
          Please enter your details to Signup.
        </h2>
        <form className="flex flex-col sm:w-[29vw] pt-12 w-[60vw]" onSubmit={handleSubmit}>
          <input
            type="name"
            placeholder="Please enter your name"
            className="rounded-[8px] p-2 my-4 border-[#e7e7e7] border-[2px] text-[20px]"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Please enter your email"
            className="rounded-[8px] p-2 my-4 border-[#e7e7e7] border-[2px] text-[20px]"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Please enter your Password"
            className="rounded-[8px] p-2 my-4 border-[#e4e4e4] border-[2px] text-[20px]"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[8px] p-2 px-6 text-white text-[24px] font-semibold my-6"
            type="submit"
            disabled={loading.normal}
          >
            {loading.normal ? "Signing up..." : "Signup"}
          </button>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading.google}
            className="rounded-[8px] p-2 px-6 text-black text-[24px] font-semibold mb-12 border-gray-200 border-[2px] inline-flex items-center justify-center"
          >
            {loading.google ? "Connecting..." : "Connect with Google"}
            <Image src="/Google.svg" alt="Google" width={32} height={32} className="pl-2" />
          </button>
          <div className="text-center mb-10">
            <h1 className="text-[20px] font-semibold">
              New here?{" "}
              <span className="text-blue-600 underline">
                <Link href="login">
                  <button className="underline">Login</button>
                </Link>
              </span>
            </h1>
          </div>
        </form>
      </div>
      <div className="sm:flex flex-col justify-between w-[50vw] h-[full] bg-gradient-to-t from-[#AB00D6] to-[#D322FF] hidden">
        <div className="text-white text-[42px] font-bold w-full p-8 text-center">Ease Design.</div>
        <div>
          <Image src="/Group 1.svg" alt="Logo" width={1000} height={600} className="max-w-[600px]" />
        </div>
      </div>
    </div>
  );
}
