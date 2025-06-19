import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  

  try {
    const { prompt } = await request.json();
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3', // Modèle à utiliser
        prompt: prompt,
        stream: false, // Désactive le streaming pour simplifier
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
    }

    const data = await ollamaResponse.json();
    return NextResponse.json({ response: data.response });

  } catch (error) {
    console.error('Error calling Ollama:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response from Ollama' },
      { status: 500 }
    );
  }
}