import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { SendVerificationCode } from "./email";
import * as schema from "../db/schema/auth";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema,
  }),

  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log("Sending reset password email to:", url);
      await SendVerificationCode({
        email: user.email,
        purpose: "Verify your email",
        username: user.name,
        url: url,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await SendVerificationCode({
        email: user.email,
        purpose: "Verify your email",
        username: user.name,
        url: url,
      });
    },
  },
});
