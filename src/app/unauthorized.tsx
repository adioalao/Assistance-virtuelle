'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/back-office/ui/button'; // si tu utilises shadcn/ui, sinon remplace
import { ShieldAlert } from 'lucide-react'; // icône d’alerte

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 p-8 text-center">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg border border-red-200">
                <div className="flex justify-center mb-4">
                    <ShieldAlert className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Accès refusé</h1>
                <p className="text-gray-600 mb-6">
                    Vous n'avez pas l'autorisation pour accéder à cette page.
                </p>
                <Button
                    onClick={() => router.push('/')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
                >
                    Retour à l'accueil
                </Button>
            </div>
        </div>
    );
}