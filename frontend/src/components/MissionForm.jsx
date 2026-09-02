import { useEffect, useState } from "react";
import {
  createMission,
  updateMission,
} from "../services/missionService";

const emptyForm = {
  client_production: "",
  date_debut: "",
  date_fin: "",
  type: "intermittence",
  statut: "proposee",
  note: "",
  heures: "",
  cachets: "",
  montant_ht: "",
  nombre_jours: "",
};

function MissionForm({
  mission,
  mode = "create",
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDateForInput = (date) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (mission) {
      setForm({
        client_production:
          mission.client_production || "",

        date_debut: formatDateForInput(
          mission.date_debut
        ),

        date_fin: formatDateForInput(
          mission.date_fin
        ),

        type: mission.type || "intermittence",
        statut: mission.statut || "proposee",
        note: mission.note || "",

        heures: mission.heures ?? "",
        cachets: mission.cachets ?? "",

        montant_ht: mission.montant_ht ?? "",
        nombre_jours: mission.nombre_jours ?? "",
      });
    } else {
      setForm({ ...emptyForm });
    }

    setError("");
  }, [mission, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "view") return;

    setError("");
    setLoading(true);

    try {
      const data = {
        client_production: form.client_production,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        type: form.type,
        statut: form.statut,
        note: form.note,
      };

      if (form.type === "intermittence") {
        if (!form.heures && !form.cachets) {
          setError(
            "Veuillez renseigner le nombre d'heures ou de cachets."
          );

          setLoading(false);
          return;
        }

        data.heures = form.heures
          ? Number(form.heures)
          : 0;

        data.cachets = form.cachets
          ? Number(form.cachets)
          : 0;

        /*
         * On vide les informations freelance
         * si le type devient intermittence.
         */
        data.montant_ht = null;
        data.nombre_jours = null;
      }

      if (form.type === "freelance") {
        if (!form.montant_ht || !form.nombre_jours) {
          setError(
            "Veuillez renseigner le montant HT et le nombre de jours."
          );

          setLoading(false);
          return;
        }

        data.montant_ht = Number(form.montant_ht);
        data.nombre_jours = Number(
          form.nombre_jours
        );

        /*
         * On vide les informations intermittence
         * si le type devient freelance.
         */
        data.heures = null;
        data.cachets = null;
      }

      if (mode === "edit") {
        await updateMission(mission._id, data);
      } else {
        await createMission(data);
      }

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          (mode === "edit"
            ? "Erreur lors de la modification de la mission"
            : "Erreur lors de la création de la mission")
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
        className="mission-form-container"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>
          {mode === "create" && "Nouvelle mission"}
          {mode === "view" &&
            "Détails de la mission"}
          {mode === "edit" &&
            "Modifier la mission"}
        </h2>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={mode === "view"}>
            <div>
              <label>Client / Production</label>

              <input
                type="text"
                name="client_production"
                value={form.client_production}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Date de début</label>

              <input
                type="date"
                name="date_debut"
                value={form.date_debut}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Date de fin</label>

              <input
                type="date"
                name="date_fin"
                value={form.date_fin}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <span>Type</span>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="intermittence"
                  checked={
                    form.type === "intermittence"
                  }
                  onChange={handleChange}
                />

                Intermittence
              </label>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="freelance"
                  checked={form.type === "freelance"}
                  onChange={handleChange}
                />

                Freelance
              </label>
            </div>

            {form.type === "intermittence" && (
              <div>
                <h3>Intermittence</h3>

                <div>
                  <label>Nombre d'heures</label>

                  <input
                    type="number"
                    min="0"
                    name="heures"
                    value={form.heures}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Nombre de cachets</label>

                  <input
                    type="number"
                    min="0"
                    name="cachets"
                    value={form.cachets}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {form.type === "freelance" && (
              <div>
                <h3>Freelance</h3>

                <div>
                  <label>Montant HT</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="montant_ht"
                    value={form.montant_ht}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Nombre de jours</label>

                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    name="nombre_jours"
                    value={form.nombre_jours}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label>Statut</label>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
              >
                <option value="proposee">
                  Proposée
                </option>

                <option value="confirmee">
                  Confirmée
                </option>

                <option value="terminee">
                  Terminée
                </option>
              </select>
            </div>

            <div>
              <label>Note</label>

              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
              />
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
            >
              {mode === "view"
                ? "Fermer"
                : "Annuler"}
            </button>

            {mode !== "view" && (
              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Enregistrement..."
                  : mode === "edit"
                  ? "Enregistrer les modifications"
                  : "Enregistrer"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default MissionForm;