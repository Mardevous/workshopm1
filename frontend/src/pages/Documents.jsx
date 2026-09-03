import { useEffect, useState } from "react";

import { getMissions } from "../services/missionService";
import {getDocuments} from "../services/documentService";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [missions, setMissions] = useState([]);

    const [file, setFile] = useState(null);
    const [categorie, setCategorie] = useState("");
    const [missionId, setMissionId] = useState("");

    const [filterCategorie, setFilterCategorie] = useState("");
    const [filterMission, setFilterMission] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const documentsData = await getDocuments(
                    filterCategorie,
                    filterMission
                );

                const missionData = await getMissions();

                setDocuments(documentsData);
                setMissions(missionData);
                
            } catch (error) {
                setError(
                error.response?.data?.message || "Erreur lors du chargement"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filterCategorie, filterMission]);

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
    <div>
        <h1>Documents</h1>

        <h2>Ajouter un document</h2>

        <form>
            <div>
                <label>Fichier : </label>

                <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>

            <div>
                <label>Catégorie : </label>

                <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                >
                    <option value="">Choisir une catégorie</option>
                    <option value="contrat">Contrat</option>
                    <option value="attestation_employeur">
                        Attestation employeur
                    </option>
                    <option value="devis">Devis</option>
                    <option value="facture">Facture</option>
                    <option value="autre">Autre</option>
                </select>
            </div>

            <div>
                <label>Mission : </label>

                <select
                    value={missionId}
                    onChange={(e) => setMissionId(e.target.value)}
                >
                    <option value="">Document global</option>

                    {missions.map((mission) => (
                        <option
                            key={mission._id}
                            value={mission._id}
                        >
                            {mission.client_production}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">
                Ajouter le document
            </button>
        </form>

        <h2>Mes documents</h2>

<div>
    <label>Catégorie : </label>

    <select
        value={filterCategorie}
        onChange={(e) => setFilterCategorie(e.target.value)}
    >
        <option value="">Toutes</option>
        <option value="contrat">Contrat</option>
        <option value="attestation_employeur">
            Attestation employeur
        </option>
        <option value="devis">Devis</option>
        <option value="facture">Facture</option>
        <option value="autre">Autre</option>
    </select>

    <label>Mission : </label>

    <select
        value={filterMission}
        onChange={(e) => setFilterMission(e.target.value)}
    >
        <option value="">Toutes les missions</option>

        {missions.map((mission) => (
            <option
                key={mission._id}
                value={mission._id}
            >
                {mission.client_production}
            </option>
        ))}
    </select>
</div>

{documents.length === 0 ? (
    <p>Aucun document trouvé.</p>
) : (
    <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Mission</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>
            {documents.map((document) => (
                <tr key={document._id}>
                    <td>{document.nom_original}</td>

                    <td>{document.categorie}</td>

                    <td>
                        {document.mission
                            ? document.mission.client_production
                            : "Global"}
                    </td>

                    <td>
                        <button>
                            Télécharger
                        </button>

                        <button>
                            Supprimer
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)};
    </div>
);

}


export default Documents;