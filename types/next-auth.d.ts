import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "ADMIN" | "EMPLOYE";
  }
  interface Session {
    user: { id: string; role: "ADMIN" | "EMPLOYE" } & DefaultSession["user"];
  }
}
