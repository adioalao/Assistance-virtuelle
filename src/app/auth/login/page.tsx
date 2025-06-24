'use client';

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Facultatif si tu veux une icône animée

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si l'utilisateur est déjà connecté, redirige-le selon son rôle
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'admin') router.push('/backoffice/Dashboard');
      else router.push('/frontoffice');
    }
  }, [session, router]);

  // Si la session est en cours de vérification
  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-100">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600 text-lg">Chargement de la session...</span>
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    }
    // Sinon redirection automatique par le useEffect
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-xl shadow-lg space-y-6 w-full max-w-2xl"
      >
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Connexion</h1>

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded text-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded text-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && <p className="text-red-500 text-base text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 rounded transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-xl">
              <Loader2 className="w-6 h-6 animate-spin" />
              Connexion...
            </div>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
}
