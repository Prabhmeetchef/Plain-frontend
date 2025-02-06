// src/lib/auth.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import { compare } from "bcryptjs";
import { NextAuthOptions, PagesOptions } from "next-auth";

// Define the shape of the user object returned by Supabase
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   password?: string;
// }

// Define the shape of the credentials object
interface Credentials {
  email: string;
  password: string;
}

// Define the shape of the Google profile
interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
}

// Validate environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
  throw new Error("Missing required environment variables");
}

// Extend the PagesOptions type to include `signUp`
interface CustomPagesOptions extends PagesOptions {
  signUp?: string;
}

// Define the authOptions object with proper typing
export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      async profile(profile: GoogleProfile) {
        const { data: existingUser, error: existingUserError } = await supabase
          .from("users")
          .select("*")
          .eq("email", profile.email)
          .single();

        if (existingUserError) {
          throw new Error("Failed to fetch user from Supabase");
        }

        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert({
            email: profile.email,
            name: profile.name,
          });

          if (insertError) {
            throw new Error("Failed to insert user into Supabase");
          }
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),

    // Email/Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (userError) {
          throw new Error("Failed to fetch user from Supabase");
        }

        if (!user) {
          throw new Error(`User with email ${credentials.email} not found`);
        }

        let isValidPassword = false;
        try {
          isValidPassword = await compare(credentials.password, user.password);
        } catch {
          throw new Error("Failed to compare passwords");
        }

        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup", // Keep the signUp property
    callback: "/app/dashboard", // Fixed the callback URL (removed @)
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  } as CustomPagesOptions, // Use the custom type
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: nextAuthSecret,
};