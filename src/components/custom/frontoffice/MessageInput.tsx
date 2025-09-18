
"use client"
import React, { useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";

export default function MessageInput() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.focus();
		}
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Vérifier que le message n'est pas vide
		const trimmedInput = input.trim();
		if (!trimmedInput) return;

		// Envoyer le message 
		console.log("Message envoyé:", trimmedInput);

		// Réinitialiser l'input
		setInput("");

		// Réinitialiser la hauteur du textarea
		if (textAreaRef.current) {
			textAreaRef.current.style.height = 'auto';
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// Shift+Enter pour aller à la ligne, Enter seul pour envoyer
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);

		// Ajuster automatiquement la hauteur du textarea
		if (textAreaRef.current) {
			textAreaRef.current.style.height = 'auto';
			textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 160) + 'px';
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="my-2 p-2 flex items-center gap-2 border-solid border-gray-200 border rounded-sm bg-white">
				{/* Zone de texte (remplacée par textarea) */}
				<textarea
					name="inputValue"
					ref={textAreaRef}
					value={input}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					className="flex-grow resize-none bg-transparent text-lg focus:outline-none placeholder-gray-500 py-2 text-gray-900"
					placeholder="Écrivez votre message ici..."
					style={{
						maxHeight: "160px",
						minHeight: "40px",
						overflowY: "auto"
					}}
					rows={1}
				/>

				{/* 📎 Bouton pour fichier */}
				{/* {onFileUpload && <FileUploader onFileUpload={onFileUpload} />} */}

				{/* Bouton envoyer */}
				<Button
					type="submit"
					title="Envoyer"
					disabled={!input.trim()} // Désactiver si vide
				>
					<PaperAirplaneIcon className="w-5 h-5" />
				</Button>
			</div>
		</form>
	);
};