import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export default ({
   providers: [
      GitHub({}),
      Credentials({})
   ]
}) satisfies NextAuthConfig; 