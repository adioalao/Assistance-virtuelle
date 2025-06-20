// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
   <div className="flex space-x-2 ml-auto ">
     <button
       className="inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800 hover:bg-red-200"
       onClick={() => signOut({ callbackUrl: "/auth/login" })}

     
    >
      Déconnexion
     </button>
  </div>
  );
}
