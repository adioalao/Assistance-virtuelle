
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username?: string | null;
    email?: string | null;
    role: string
  }

  interface Session {
    user: {
      id: string;
      username?: string | null;
      email?: string | null;
      role: string
    };
  }
}
interface ApiResponse {
  chatroomWithMessage: {
    messages: Message[];
  };
}
const data = await res.json() as ApiResponse;


// Extension des types JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Ajoutez l'ID au token JWT
  }
}