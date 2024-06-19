import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any): Promise<any> => {
        await dbConnect();

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) throw new Error("no user found with email or username");

          if (!user.isVerified)
            throw new Error("please verify account before login");

          if (await bcrypt.compare(credentials.password, user.password))
            return user;
          else throw new Error("incorrect password");
          //   auth done
        } catch (error: any) {
          console.error("error occured in nextauth", error);

          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.userId = user.userId;
        token.username = user.username;
        token.isActive = user.isActive;
        token.isVerified = user.isVerified;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.userId = token.userId;
        session.user.username = token.username;
        session.user.isActive = token.isActive;
        session.user.isVerified = token.isVerified;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
