import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function UpdateFaq({
    open,
    onClose,
    onFaqUpdate,
    id_FAQ,
    initialQuestion = "",
    initialReponse = "",
    ...props
}: {
    open: boolean;
    onClose: () => void;
    onFaqUpdate: () => void;
    id_FAQ: number;
    initialQuestion?: string;
    initialReponse?: string;
} & React.ComponentProps<"div">) {
    const [contenu, setContenu] = React.useState(initialQuestion);
    const [reponse, setReponse] = React.useState(initialReponse);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    // Synchronise les valeurs initiales si le dialog s'ouvre sur une autre question
    React.useEffect(() => {
        setContenu(initialQuestion);
        setReponse(initialReponse);
    }, [initialQuestion, initialReponse, open]);

    const handleSave = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/faq/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id_FAQ, contenu, reponse }),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour");
            onFaqUpdate(); // Notifie le parent (DataTable) de rafraîchir la liste
            onClose();
        } catch (e) {
            setError("Erreur lors de la mise à jour de la FAQ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose} {...props}>
            <DialogContent className="sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editer une FAQ</DialogTitle>
                    <DialogDescription>
                        Remplissez la question et/ou la réponse.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="new-question" className="font-medium">Question</label>
                        <Textarea
                            id="new-question"
                            value={contenu ?? ""}
                            onChange={e => setContenu(e.target.value)}
                            className="w-full min-h-[80px]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="new-reponse" className="font-medium">Réponse</label>
                        <Textarea
                            id="new-reponse"
                            value={reponse ?? ""}
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
                        onClick={handleSave}
                        disabled={!contenu || !reponse || loading}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}