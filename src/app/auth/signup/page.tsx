"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true to show a loading indicator

    try {
      // Step 1: Sign up the user
      const signUpResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Send the form data (name, email, password) to the server
      });

      // Check if the signup was successful
      if (!signUpResponse.ok) {
        throw new Error("Signup failed"); // Throw an error if the response is not OK
      }

      // Step 2: Sign in the user
      const signInResponse = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false, // Prevent automatic redirect (we'll handle it manually)
      });

      // Check if the sign-in was successful
      if (signInResponse?.error) {
        throw new Error(signInResponse.error); // Throw an error if there's a sign-in error
      }

      // Step 3: Redirect to the dashboard
      router.push("/dashboard"); // Redirect the user to the dashboard after successful sign-in
    } catch (error) {
      console.error("Error during signup/signin:", error); // Log the error for debugging
      alert("Signup or signin failed. Please try again."); // Show an error message to the user
    } finally {
      setLoading(false); // Reset the loading state (whether successful or not)
    }
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center w-[100vw] h-[100vh]">
        <div className="sm:w-[50vw] flex flex-col items-center h-[100vh] w-[80vw]">
          <Link href="/">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={120}
              height={80}
              className="pt-[65px]"
            ></Image>
          </Link>
          <h1 className="text-black text-[40px] font-bold block pt-12">
            Hey There!
          </h1>
          <h2 className="text-[#949494] text-[26px] font-semibold block">
            Please enter your details to Signup.
          </h2>
          <form
            className="flex flex-col sm:w-[29vw] pt-12 w-[60vw]"
            onSubmit={handleSubmit}
          >
            <input
              type="name"
              placeholder="Please enter your name"
              className="rounded-[8px] p-2 my-4 border-[#e7e7e7] border-[2px] text-[20px]"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            ></input>
            <input
              type="email"
              placeholder="Please enter your email"
              className="rounded-[8px] p-2 my-4 border-[#e7e7e7] border-[2px] text-[20px]"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            ></input>
            <input
              type="password"
              placeholder="Please enter your Password"
              className="rounded-[8px] p-2 my-4 border-[#e4e4e4] border-[2px] text-[20px]"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            ></input>
            <button
              className="bg-gradient-to-t from-[#AB00D6] to-[#D322FF] rounded-[8px] p-2 px-6 text-white text-[24px] font-semibold my-6"
              type="submit"
            >
              Signup
            </button>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="rounded-[8px] p-2 px-6 text-black text-[24px] font-semibold mb-12 border-gray-200 border-[2px] inline-flex items-center justify-center"
            >
              {loading ? "Connecting..." : "Connect with Google"}
              <Image
                src="/Google.svg"
                alt="Google"
                width={32}
                height={32}
                className="pl-2"
              ></Image>
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
          <div className="text-white text-[42px] font-bold w-full p-8 text-center">
            Ease Design.
          </div>
          <div>
            <Image
              src="/Group 1.svg"
              alt="Logo"
              width={1000}
              height={600}
              className="max-w-[600px]"
            ></Image>
          </div>
        </div>
      </div>
    </>
  );
}
