import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/backoffice/ui/dialog";
import { Button } from "@/components/backoffice/ui/button";
import { Textarea } from "@/components/backoffice/ui/textarea";

export function AddFaqDialog({
    open,
    onClose,
    onFaqAdded,
}: {
    open: boolean;
    onClose: () => void;
    onFaqAdded: () => void;
}) {
    const [contenu, setContenu] = React.useState("");
    const [reponse, setReponse] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleAdd = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/faq/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contenu, reponse }),
            });
            if (!res.ok) throw new Error("Erreur lors de l'ajout");
            setContenu("");
            setReponse("");
            onFaqAdded();
            onClose();
        } catch (e) {
            setError("Erreur lors de l'ajout de la FAQ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter une FAQ</DialogTitle>
                    <DialogDescription>
                        Remplissez la question et la réponse.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="new-question" className="font-medium">Question</label>
                        <Textarea
                            id="new-question"
                            value={contenu}
                            onChange={e => setContenu(e.target.value)}
                            className="w-full min-h-[80px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="new-reponse" className="font-medium">Réponse</label>
                        <Textarea
                            id="new-reponse"
                            value={reponse}
                            onChange={e => setReponse(e.target.value)}
                            className="w-full min-h-[120px]"
                        />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleAdd}
                        disabled={!contenu || !reponse || loading}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}