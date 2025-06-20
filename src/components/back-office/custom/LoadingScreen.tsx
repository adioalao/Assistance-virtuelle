'use client';

import { Loader2 } from 'lucide-react'; // icône de chargement
import React from 'react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 animate-pulse">
                Chargement en cours...
            </h1>
            <p className="text-gray-500 mt-2">
                Veuillez patienter un instant.
            </p>
        </div>
    );
}