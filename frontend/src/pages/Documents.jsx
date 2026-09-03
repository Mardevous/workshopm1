import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  getMissions,
} from "../services/missionService";

import {
  getDocuments,
  viewDocument,
  downloadDocument,
  deleteDocument,
} from "../services/documentService";

import DocumentForm from "../components/DocumentForm";

function Documents() {
  const navigate = useNavigate();

  // Liste des documents
  const [documents, setDocuments] =
    useState([]);

  // Liste des missions
  const [missions, setMissions] =
    useState([]);

  // Filtre par catégorie
  const [
    filterCategorie,
    setFilterCategorie,
  ] = useState("");

  // Filtre par mission
  const [
    filterMission,
    setFilterMission,
  ] = useState("");

  // Recherche d'une mission
  const [
    missionSearch,
    setMissionSearch,
  ] = useState("");

  // Affichage de la liste
  const [
    showMissionDropdown,
    setShowMissionDropdown,
  ] = useState(false);

  // Affichage du formulaire
  const [showForm, setShowForm] =
    useState(false);

  // État du chargement
  const [loading, setLoading] =
    useState(true);

  // Message d'erreur
  const [error, setError] =
    useState("");

  // Message de succès
  const [message, setMessage] =
    useState("");

  // Récupérer les documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDocuments(
        filterCategorie,
        filterMission
      );

      setDocuments(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des documents"
      );
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les missions
  const fetchMissions = async () => {
    try {
      const data = await getMissions();

      setMissions(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du chargement des missions"
      );
    }
  };

  // Charger les missions
  useEffect(() => {
    fetchMissions();
  }, []);

  // Actualiser les documents
  useEffect(() => {
    fetchDocuments();
  }, [
    filterCategorie,
    filterMission,
  ]);

  // Déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Formater une date
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString("fr-FR");
  };

  // Formater une catégorie
  const formatCategorie = (
    categorie
  ) => {
    const categories = {
      contrat: "Contrat",

      attestation_employeur:
        "Attestation employeur",

      devis: "Devis",
      facture: "Facture",
      autre: "Autre",
    };

    return (
      categories[categorie] ||
      categorie
    );
  };

  // Trouver le nom du filtre
  const selectedMissionLabel = (() => {
    if (!filterMission) {
      return "Toutes les missions";
    }

    if (filterMission === "global") {
      return "Documents globaux";
    }

    const selectedMission =
      missions.find(
        (mission) =>
          mission._id ===
          filterMission
      );

    return (
      selectedMission
        ?.client_production ||
      "Toutes les missions"
    );
  })();

  // Filtrer les missions
  const filteredMissions =
    missions.filter((mission) =>
      mission.client_production
        .toLowerCase()
        .startsWith(
          missionSearch
            .trim()
            .toLowerCase()
        )
    );

  // Sélectionner une mission
  const selectMission = (
    missionId,
    missionName
  ) => {
    setFilterMission(missionId);
    setMissionSearch(missionName);
    setShowMissionDropdown(false);
  };

  // Actualiser après un ajout
  const handleUploadSuccess =
    async () => {
      setMessage(
        "Document ajouté avec succès."
      );

      await fetchDocuments();
    };

  // Ouvrir un document
  const handleView = async (
    document
  ) => {
    try {
      setError("");

      const blob = await viewDocument(
        document._id
      );

      // Créer le fichier
      const fileBlob = new Blob(
        [blob],
        {
          type:
            document.mime_type ||
            "application/octet-stream",
        }
      );

      // Créer une URL temporaire
      const url =
        window.URL.createObjectURL(
          fileBlob
        );

      // Ouvrir dans un nouvel onglet
      const previewWindow =
        window.open(url, "_blank");

      if (!previewWindow) {
        setError(
          "Le navigateur a bloqué l'ouverture du document."
        );
      }

      // Supprimer l'URL temporaire
      setTimeout(() => {
        window.URL.revokeObjectURL(
          url
        );
      }, 60000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de l'ouverture du document"
      );
    }
  };

  // Télécharger un document
  const handleDownload = async (
    document
  ) => {
    try {
      setError("");

      const blob =
        await downloadDocument(
          document._id
        );

      // Créer le fichier
      const fileBlob = new Blob(
        [blob],
        {
          type:
            document.mime_type ||
            "application/octet-stream",
        }
      );

      // Créer une URL temporaire
      const url =
        window.URL.createObjectURL(
          fileBlob
        );

      // Créer un lien
      const link =
        window.document.createElement(
          "a"
        );

      link.href = url;
      link.download = document.nom;

      window.document.body.appendChild(
        link
      );

      // Lancer le téléchargement
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors du téléchargement"
      );
    }
  };

  // Supprimer un document
  const handleDelete = async (id) => {
    const confirmation =
      window.confirm(
        "Voulez-vous vraiment supprimer ce document ?"
      );

    if (!confirmation) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDocument(id);

      setMessage(
        "Document supprimé avec succès."
      );

      await fetchDocuments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erreur lors de la suppression du document"
      );
    }
  };

  return (
    <div className="documents-page">
      {/* Retour au tableau de bord */}
      <Link
        className="documents-back-link"
        to="/dashboard"
      >
        ← Retour au dashboard
      </Link>

      {/* En-tête */}
      <div className="documents-header">
        <div>
          <h1>Documents</h1>

          <p>
            Gérez vos contrats,
            attestations, devis et
            factures.
          </p>
        </div>

        <button
          className="documents-logout-button"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      {/* Outils et filtres */}
      <div className="documents-toolbar">
        {/* Bouton d'ajout */}
        <button
          className="documents-create-button"
          onClick={() => {
            setMessage("");
            setError("");
            setShowForm(true);
          }}
        >
          + Ajouter un document
        </button>

        {/* Filtres */}
        <div className="documents-filters">
          {/* Filtre par catégorie */}
          <label className="documents-filter">
            <span>Catégorie</span>

            <select
              value={filterCategorie}
              onChange={(e) =>
                setFilterCategorie(
                  e.target.value
                )
              }
            >
              <option value="">
                Toutes
              </option>

              <option value="contrat">
                Contrat
              </option>

              <option value="attestation_employeur">
                Attestation employeur
              </option>

              <option value="devis">
                Devis
              </option>

              <option value="facture">
                Facture
              </option>

              <option value="autre">
                Autre
              </option>
            </select>
          </label>

          {/* Filtre par mission */}
          <div className="documents-filter">
            <span>Mission</span>

            <div className="mission-dropdown">
              {/* Recherche */}
              <input
                type="text"
                className="mission-dropdown-input"
                value={missionSearch}
                placeholder="Rechercher une mission"
                autoComplete="off"
                onFocus={() => {
                  setMissionSearch("");

                  setShowMissionDropdown(
                    true
                  );
                }}
                onClick={() => {
                  setShowMissionDropdown(
                    true
                  );
                }}
                onChange={(e) => {
                  setMissionSearch(
                    e.target.value
                  );

                  setShowMissionDropdown(
                    true
                  );
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowMissionDropdown(
                      false
                    );

                    if (!missionSearch) {
                      setMissionSearch(
                        selectedMissionLabel
                      );
                    }
                  }, 150);
                }}
              />

              {/* Liste des missions */}
              {showMissionDropdown && (
                <div className="mission-dropdown-panel">
                  <div className="mission-dropdown-options">
                    {/* Toutes les missions */}
                    <button
                      type="button"
                      className="
                        mission-dropdown-option
                        mission-dropdown-special
                      "
                      onMouseDown={() =>
                        selectMission(
                          "",
                          "Toutes les missions"
                        )
                      }
                    >
                      Toutes les missions
                    </button>

                    {/* Documents sans mission */}
                    <button
                      type="button"
                      className="
                        mission-dropdown-option
                        mission-dropdown-special
                      "
                      onMouseDown={() =>
                        selectMission(
                          "global",
                          "Documents globaux"
                        )
                      }
                    >
                      Documents globaux
                    </button>

                    {/* Missions trouvées */}
                    {filteredMissions.map(
                      (mission) => (
                        <button
                          type="button"
                          className="mission-dropdown-option"
                          key={
                            mission._id
                          }
                          onMouseDown={() =>
                            selectMission(
                              mission._id,
                              mission.client_production
                            )
                          }
                        >
                          {/* Type de mission */}
                          <span
                            className={`document-mission-type ${
                              mission.type ===
                              "intermittence"
                                ? "document-mission-intermittence"
                                : "document-mission-freelance"
                            }`}
                          >
                            {mission.type ===
                            "intermittence"
                              ? "Intermittence"
                              : "Freelance"}
                          </span>

                          {/* Nom de la mission */}
                          <span className="mission-option-name">
                            {
                              mission.client_production
                            }
                          </span>

                          {/* Dates de la mission */}
                          <span className="mission-option-date">
                            {formatDate(
                              mission.date_debut
                            )}

                            {" → "}

                            {formatDate(
                              mission.date_fin
                            )}
                          </span>
                        </button>
                      )
                    )}

                    {/* Aucun résultat */}
                    {filteredMissions.length ===
                      0 && (
                      <p className="mission-option-empty">
                        Aucune mission
                        trouvée
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <DocumentForm
          missions={missions}
          onClose={() =>
            setShowForm(false)
          }
          onSuccess={
            handleUploadSuccess
          }
        />
      )}

      {/* Message de succès */}
      {message && (
        <p className="documents-success">
          {message}
        </p>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="documents-error">
          {error}
        </p>
      )}

      {/* Chargement */}
      {loading && (
        <div className="documents-state">
          Chargement...
        </div>
      )}

      {/* Aucun document */}
      {!loading &&
        documents.length === 0 && (
          <div className="documents-empty">
            <strong>
              Aucun document trouvé
            </strong>

            <p>
              Modifiez les filtres ou
              ajoutez un nouveau document.
            </p>
          </div>
        )}

      {/* Liste des documents */}
      {!loading &&
        documents.length > 0 && (
          <div className="documents-table-card">
            {/* Informations de la liste */}
            <div className="documents-table-header">
              <div>
                <h2>Mes documents</h2>

                <p>
                  {documents.length} document
                  {documents.length > 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>

            {/* Tableau */}
            <div className="documents-table-wrapper">
              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Mission</th>
                    <th>Taille</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Afficher les documents */}
                  {documents.map(
                    (document) => {
                      const mission =
                        document.mission_id;

                      return (
                        <tr
                          key={
                            document._id
                          }
                        >
                          {/* Nom */}
                          <td>
                            <strong className="document-name">
                              {document.nom}
                            </strong>
                          </td>

                          {/* Catégorie */}
                          <td>
                            <span className="document-category">
                              {formatCategorie(
                                document.categorie
                              )}
                            </span>
                          </td>

                          {/* Mission associée */}
                          <td>
                            {mission ? (
                              <div className="document-mission">
                                <div className="document-mission-header">
                                  <span
                                    className={`document-mission-type ${
                                      mission.type ===
                                      "intermittence"
                                        ? "document-mission-intermittence"
                                        : "document-mission-freelance"
                                    }`}
                                  >
                                    {mission.type ===
                                    "intermittence"
                                      ? "Intermittence"
                                      : "Freelance"}
                                  </span>

                                  <span className="document-mission-date">
                                    {formatDate(
                                      mission.date_debut
                                    )}

                                    {" → "}

                                    {formatDate(
                                      mission.date_fin
                                    )}
                                  </span>
                                </div>

                                <strong>
                                  {
                                    mission.client_production
                                  }
                                </strong>
                              </div>
                            ) : (
                              <span className="document-global">
                                Global
                              </span>
                            )}
                          </td>

                          {/* Taille du fichier */}
                          <td>
                            <span className="document-size">
                              {Math.round(
                                document.taille /
                                  1024
                              )}{" "}
                              Ko
                            </span>
                          </td>

                          {/* Boutons d'action */}
                          <td>
                            <div className="document-actions">
                              <button
                                className="
                                  action-button
                                  action-view
                                "
                                onClick={() =>
                                  handleView(
                                    document
                                  )
                                }
                              >
                                Voir
                              </button>

                              <button
                                className="
                                  action-button
                                  action-download
                                "
                                onClick={() =>
                                  handleDownload(
                                    document
                                  )
                                }
                              >
                                Télécharger
                              </button>

                              <button
                                className="
                                  action-button
                                  action-delete
                                "
                                onClick={() =>
                                  handleDelete(
                                    document._id
                                  )
                                }
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

export default Documents;