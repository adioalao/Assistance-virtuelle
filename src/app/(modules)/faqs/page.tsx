import { columns, Question } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Question[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            categorie: "Excel",
            question: "Comment créer un nouveau classeur dans Excel ?",
            reponse: "Je ne sais pas",
            dateCreation: "01/05/24",
            dateModification: "24/05/25"
        },
        {
            id: "a3b5c7e9",
            categorie: "Excel",
            question: "Comment utiliser la fonction RECHERCHEV ?",
            reponse: "Utilisez la formule =RECHERCHEV(...) dans une cellule.",
            dateCreation: "15/03/24",
            dateModification: "10/05/25"
        },
        {
            id: "d4f6h8j0",
            categorie: "Word",
            question: "Comment créer un sommaire automatique ?",
            reponse: "Allez dans Références > Table des matières.",
            dateCreation: "22/04/24",
            dateModification: "18/05/25"
        },
        {
            id: "k2l4m6n8",
            categorie: "PowerPoint",
            question: "Comment ajouter une transition entre diapositives ?",
            reponse: "Sélectionnez une diapositive puis Transitions.",
            dateCreation: "05/01/24",
            dateModification: "30/05/25"
        },
        {
            id: "p1q3r5s7",
            categorie: "Word",
            question: "Comment enregistrer un document sous PDF ?",
            reponse: "Fichier > Exporter > Créer un document PDF/XPS.",
            dateCreation: "12/02/24",
            dateModification: "20/05/25"
        },
        {
            id: "t9u1v3w5",
            categorie: "Excel",
            question: "Comment créer un graphique à partir de données ?",
            reponse: "Sélectionnez les données puis Insertion > Graphique.",
            dateCreation: "08/04/24",
            dateModification: "25/05/25"
        },
        {
            id: "x7y9z2a4",
            categorie: "PowerPoint",
            question: "Comment insérer une vidéo dans une diapositive ?",
            reponse: "Insertion > Vidéo.",
            dateCreation: "17/03/24",
            dateModification: "22/05/25"
        },
        {
            id: "b6c8d0e2",
            categorie: "Excel",
            question: "Comment trier des données par ordre alphabétique ?",
            reponse: "Accueil > Trier et filtrer.",
            dateCreation: "03/05/24",
            dateModification: "28/05/25"
        },
        {
            id: "f4g6h8i0",
            categorie: "Word",
            question: "Comment modifier les marges d'un document ?",
            reponse: "Mise en page > Marges.",
            dateCreation: "11/01/24",
            dateModification: "15/05/25"
        },
        {
            id: "j2k4l6m8",
            categorie: "PowerPoint",
            question: "Comment ajouter des animations à du texte ?",
            reponse: "Animations > Ajouter une animation.",
            dateCreation: "29/04/24",
            dateModification: "27/05/25"
        },
        {
            id: "n0o2p4q6",
            categorie: "Excel",
            question: "Comment protéger une feuille par un mot de passe ?",
            reponse: "Révision > Protéger la feuille.",
            dateCreation: "14/02/24",
            dateModification: "19/05/25"
        },
        {
            id: "r8s0t2u4",
            categorie: "Word",
            question: "Comment insérer un saut de page ?",
            reponse: "Insertion > Saut de page.",
            dateCreation: "07/03/24",
            dateModification: "21/05/25"
        },
        {
            id: "v6w8x0y2",
            categorie: "PowerPoint",
            question: "Comment réduire la taille d'un fichier PowerPoint ?",
            reponse: "Fichier > Compresser les images.",
            dateCreation: "09/05/24",
            dateModification: "26/05/25"
        },
        {
            id: "z4a6b8c0",
            categorie: "Excel",
            question: "Comment utiliser la mise en forme conditionnelle ?",
            reponse: "Accueil > Mise en forme conditionnelle.",
            dateCreation: "25/01/24",
            dateModification: "16/05/25"
        },
        {
            id: "d2e4f6g8",
            categorie: "Word",
            question: "Comment créer un modèle de document personnalisé ?",
            reponse: "Fichier > Enregistrer sous > Modèle.",
            dateCreation: "30/04/24",
            dateModification: "29/05/25"
        }
    ];
}

export default async function FAQs() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}