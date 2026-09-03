import { useState } from "react";
import {
  addDocument,
} from "../services/documentService";

function DocumentForm({
  missions,
  onClose,
  onSuccess,
}) {
  // Fichier sélectionné
  const [file, setFile] = useState(null);

  // Catégorie sélectionnée
  const [categorie, setCategorie] = useState("");

  // Mission sélectionnée
  const [missionId, setMissionId] = useState("");

  // Texte de recherche
  const [ missionSearch, setMissionSearch ] = useState("Document global");

  // Affichage de la liste
  const [ showMissionDropdown, setShowMissionDropdown ] = useState(false);

  // Message d'erreur
  const [error, setError] = useState("");

  // État du chargement
  const [loading, setLoading] = useState(false);

  // Formater une date
  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString("fr-FR");
  };

  // Créer le texte d'une mission
  const getMissionLabel = (
    mission
  ) => {
    if (!mission) {
      return "Document global";
    }

    const type =
      mission.type === "intermittence"
        ? "Intermittence"
        : "Freelance";

    return `${type} — ${
      mission.client_production
    } — ${formatDate(
      mission.date_debut
    )} → ${formatDate(
      mission.date_fin
    )}`;
  };

  // Trouver la mission sélectionnée
  const selectedMission =
    missions.find(
      (mission) =>
        mission._id === missionId
    ) || null;

  // Texte de la mission sélectionnée
  const selectedMissionLabel = getMissionLabel(selectedMission);

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
  const handleSelectMission = (
    mission
  ) => {
    if (!mission) {
      // Choisir un document global
      setMissionId("");

      setMissionSearch(
        "Document global"
      );
    } else {
      setMissionId(mission._id);

      setMissionSearch(
        getMissionLabel(mission)
      );
    }

    // Fermer la liste
    setShowMissionDropdown(false);
  };

  // Envoyer le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Vérifier le fichier
    if (!file) {
      setError(
        "Veuillez choisir un fichier."
      );

      return;
    }

    // Vérifier la catégorie
    if (!categorie) {
      setError(
        "Veuillez choisir une catégorie."
      );

      return;
    }

    // Préparer les données
    const formData = new FormData();

    formData.append("fichier", file);

    formData.append(
      "categorie",
      categorie
    );

    // Ajouter la mission
    if (missionId) {
      formData.append(
        "mission_id",
        missionId
      );
    }

    try {
      setLoading(true);

      // Ajouter le document
      await addDocument(formData);

      // Actualiser la liste
      if (onSuccess) {
        await onSuccess();
      }

      // Fermer le formulaire
      onClose();
    } catch (error) {
      // Afficher l'erreur
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'ajout du document"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fenêtre du formulaire
    <div
      className="mission-form-overlay"
      onMouseDown={onClose}
    >
      <div
        className="
          mission-form-container
          document-form-container
        "
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* En-tête */}
        <div className="mission-form-header">
          <div>
            <h2>
              Ajouter un document
            </h2>

            <p>
              Ajoutez un document global
              ou associez-le à une mission.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form
          className="mission-form"
          onSubmit={handleSubmit}
        >
          <fieldset disabled={loading}>
            {/* Choix du fichier */}
            <div className="mission-form-field">
              <label htmlFor="document-file">
                Fichier
              </label>

              <div className="document-file-field">
                <input
                  id="document-file"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) =>
                    setFile(
                      e.target
                        .files?.[0] ||
                        null
                    )
                  }
                  required
                />

                <p className="document-field-help">
                  Fichiers PDF et images
                  acceptés.
                </p>
              </div>
            </div>

            {/* Choix de la catégorie */}
            <div className="mission-form-field">
              <label htmlFor="document-category">
                Catégorie
              </label>

              <select
                id="document-category"
                value={categorie}
                onChange={(e) =>
                  setCategorie(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Choisir une catégorie
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
            </div>

            {/* Choix de la mission */}
            <div className="mission-form-field document-mission-field">
              <label htmlFor="document-mission">
                Mission
              </label>

              <div className="mission-dropdown">
                {/* Recherche */}
                <input
                  id="document-mission"
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
                  onClick={() =>
                    setShowMissionDropdown(
                      true
                    )
                  }
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

                      setMissionSearch(
                        selectedMissionLabel
                      );
                    }, 150);
                  }}
                />

                {/* Liste des missions */}
                {showMissionDropdown && (
                  <div className="mission-dropdown-panel">
                    <div className="mission-dropdown-options">
                      {/* Document sans mission */}
                      <button
                        type="button"
                        className="
                          mission-dropdown-option
                          mission-dropdown-special
                        "
                        onMouseDown={(e) => {
                          e.preventDefault();

                          handleSelectMission(
                            null
                          );
                        }}
                      >
                        Document global
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
                            onMouseDown={(
                              e
                            ) => {
                              e.preventDefault();

                              handleSelectMission(
                                mission
                              );
                            }}
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

                            <span> </span>

                            {/* Nom de la mission */}
                            <span className="mission-option-name">
                              {
                                mission.client_production
                              }
                            </span>

                            <span> </span>

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

              <p className="document-field-help">
                Laissez « Document global »
                si le document n'appartient
                à aucune mission.
              </p>
            </div>
          </fieldset>

          {/* Message d'erreur */}
          {error && (
            <p className="mission-form-error">
              {error}
            </p>
          )}

          {/* Boutons */}
          <div className="mission-form-actions">
            <button
              type="button"
              className="mission-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="mission-save-button"
              disabled={loading}
            >
              {loading
                ? "Envoi en cours..."
                : "Ajouter le document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocumentForm;