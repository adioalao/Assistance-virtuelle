import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import React from "react"

export const AddFaqDialog = React.memo(function AddFaqDialog({
    open,
    onClose,
    onAdd,
}: {
    open: boolean
    onClose: () => void
    onAdd: (question: string, reponse: string) => void
}) {
    const [question, setQuestion] = React.useState("")
    const [reponse, setReponse] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const handleSave = React.useCallback(() => {
        onAdd(question, reponse, categorie)

        setQuestion("")
        setReponse("")
        onClose()
    }, [onAdd, question, reponse, onClose])

    console.log('Render: addFaqDialog');


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
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!question || !reponse || loading}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})