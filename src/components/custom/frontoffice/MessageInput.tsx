"use client"
import React, { useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import FileUploader from "./FileUploader";
import { Button } from "@/components/ui/button";

type MessageInputProps = {
	handleSendMessage: () => void;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	onSend: (message: string) => void;
	onFileUpload?: (url: string, type: string) => void;
}

export default function MessageInput() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.focus();
		}
	}, [])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(e.currentTarget);
		console.log(formData.get("inputValue"));
	};
	return (
		<form onSubmit={handleSubmit} >
			<div className="my-2 pr-2 flex items-center gap-2 border-solid border-gray-200 border rounded-sm bg-white">
				{/* Zone de texte */}
				<textarea name="inputValue"
					ref={textAreaRef}
					rows={2}
					className="flex-grow resize-none bg-transparent text-lg focus:outline-none placeholder-gray-500 py-2 text-gray-900"
					placeholder="Écrivez votre message ici..."
					style={{
						maxHeight: "160px",
					}}
				/>

				{/* 📎 Bouton pour fichier */}
				{/* {onFileUpload && <FileUploader onFileUpload={onFileUpload} />} */}

				{/* Bouton envoyer */}
				<Button
					type="submit"
					title="Envoyer"
				>
					<PaperAirplaneIcon className="w-5 h-5" />
				</Button>
			</div>

		</form>
	);
};

