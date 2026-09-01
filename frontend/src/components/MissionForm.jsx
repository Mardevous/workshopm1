import { useState } from "react";
import { createMission } from "../services/missionService";

function MissionForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
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
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // Intermittence
      if (form.type === "intermittence") {
        if (!form.heures && !form.cachets) {
          setError(
            "Veuillez renseigner le nombre d'heures ou de cachets."
          );
          setLoading(false);
          return;
        }

        if (form.heures) {
          data.heures = Number(form.heures);
        }

        if (form.cachets) {
          data.cachets = Number(form.cachets);
        }
      }

      // Freelance
      if (form.type === "freelance") {
        data.montant_ht = Number(form.montant_ht);
        data.nombre_jours = Number(form.nombre_jours);
      }

      await createMission(data);

      onSuccess();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de la création de la mission"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mission-form-container">
      <h2>Nouvelle mission</h2>

      <form onSubmit={handleSubmit}>
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
          <label>Type</label>

          <label>
            <input
              type="radio"
              name="type"
              value="intermittence"
              checked={form.type === "intermittence"}
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

        {/* Champs Intermittence */}
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

        {/* Champs Freelance */}
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
            <option value="proposee">Proposée</option>
            <option value="confirmee">Confirmée</option>
            <option value="terminee">Terminée</option>
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

        {error && <p>{error}</p>}

        <div>
          <button
            type="button"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MissionForm;