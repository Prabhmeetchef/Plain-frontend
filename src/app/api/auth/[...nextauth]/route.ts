import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase"; // Using the alias @ for src/
import { compare } from "bcryptjs";

// Define the shape of the user object returned by Supabase
interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional because it might not be returned in all queries
}

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

// Define the authOptions object with proper typing
export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile: GoogleProfile) {
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", profile.email)
          .single();

        if (!existingUser) {
          await supabase.from("users").insert({
            email: profile.email,
            name: profile.name,
          });
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
          throw new Error("Missing email or password");
        }

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup", // Keep the signUp property
    callback: "/app/dashboard", // Fixed the callback URL (removed @)
  } as Record<string, string>, // Fix: Cast the pages object to a generic Record type
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };