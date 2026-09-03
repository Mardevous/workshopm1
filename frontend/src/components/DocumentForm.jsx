import { useState } from "react";
import { addDocument } from "../services/documentService";

function DocumentForm({
  missions,
  onClose,
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [categorie, setCategorie] = useState("");

  const [missionId, setMissionId] =
    useState("");

  const [missionSearch, setMissionSearch] =
    useState("Document global");

  const [
    showMissionDropdown,
    setShowMissionDropdown,
  ] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "fr-FR"
    );
  };

  const getMissionLabel = (mission) => {
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
    )} → ${formatDate(mission.date_fin)}`;
  };

  const selectedMission =
    missions.find(
      (mission) => mission._id === missionId
    ) || null;

  const selectedMissionLabel =
    getMissionLabel(selectedMission);

  const filteredMissions = missions.filter(
    (mission) =>
      mission.client_production
        .toLowerCase()
        .startsWith(
          missionSearch.trim().toLowerCase()
        )
  );

  const handleSelectMission = (mission) => {
    if (!mission) {
      setMissionId("");
      setMissionSearch("Document global");
    } else {
      setMissionId(mission._id);
      setMissionSearch(
        getMissionLabel(mission)
      );
    }

    setShowMissionDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!file) {
      setError(
        "Veuillez choisir un fichier."
      );
      return;
    }

    if (!categorie) {
      setError(
        "Veuillez choisir une catégorie."
      );
      return;
    }

    const formData = new FormData();

    formData.append("fichier", file);
    formData.append(
      "categorie",
      categorie
    );

    // 没有mission_id时，后端保存null
    if (missionId) {
      formData.append(
        "mission_id",
        missionId
      );
    }

    try {
      setLoading(true);

      await addDocument(formData);

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
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
    <div
      className="mission-form-overlay"
      onMouseDown={onClose}
    >
      <div
        className="mission-form-container document-form-container"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <h2>Ajouter un document</h2>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div>
              <label>Fichier</label>

              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
                required
              />
            </div>

            <div>
              <label>Catégorie</label>

              <select
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

            <div className="document-mission-field">
              <label>Mission</label>

              <div className="mission-dropdown">
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

                {showMissionDropdown && (
                  <div className="mission-dropdown-panel">
                    <div className="mission-dropdown-options">
                      <button
                        type="button"
                        className="mission-dropdown-option mission-dropdown-special"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMission(
                            null
                          );
                        }}
                      >
                        Document global
                      </button>

                      {filteredMissions.map(
                        (mission) => (
                          <button
                            type="button"
                            className="mission-dropdown-option"
                            key={mission._id}
                            onMouseDown={(
                              e
                            ) => {
                              e.preventDefault();

                              handleSelectMission(
                                mission
                              );
                            }}
                          >
                            <span
                              className={`mission-type-badge ${
                                mission.type ===
                                "intermittence"
                                  ? "event-intermittence"
                                  : "event-freelance"
                              }`}
                            >
                              {mission.type ===
                              "intermittence"
                                ? "Intermittence"
                                : "Freelance"}
                            </span>

                            <span className="mission-option-name">
                              {
                                mission.client_production
                              }
                            </span>

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

                      {filteredMissions.length ===
                        0 && (
                        <p className="mission-option-empty">
                          Aucune mission trouvée
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {error && (
            <p className="mission-form-error">
              {error}
            </p>
          )}

          <div className="mission-form-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>

            <button
              type="submit"
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