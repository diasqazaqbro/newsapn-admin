import CredentialsProvider from "next-auth/providers/credentials";
import { setCorsHeaders } from "./cors";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "Введите логин",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Введите пароль",
        },
      },
      async authorize(credentials) {
        const user = { id: "42", name: "root", password: "1234" };
        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "default-secret-key",
};
