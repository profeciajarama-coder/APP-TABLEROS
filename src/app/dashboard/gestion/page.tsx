"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBoards, type Board } from "../../layout";

interface BoardFormData {
  name: string;
  location: string;
  status: "active" | "warning" | "inactive";
  voltage: string;
  current: string;
  power: string;
  frequency: string;
  lastInspection: string;
  nextMaintenance: string;
  alerts: string;
}

const emptyForm: BoardFormData = {
  name: "",
  location: "",
  status: "active",
  voltage: "400V",
  current: "0A",
  power: "0kVA",
  frequency: "50Hz",
  lastInspection: new Date().toISOString().split("T")[0],
  nextMaintenance: "",
  alerts: ""
};

function getStatusLabel(status: string): string {
  switch (status) {
    case "active": return "Operativo";
    case "warning": return "Alerta";
    case "inactive": return "Inactivo";
    default: return status;
  }
}

export default function GestionPage() {
  const router = useRouter();
  const { boards, addBoard, updateBoard, deleteBoard } = useBoards();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BoardFormData>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [router, isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alertsArray = formData.alerts.split("\n").filter(a => a.trim());
    
    if (editingId) {
      updateBoard(editingId, {
        ...formData,
        alerts: alertsArray
      });
    } else {
      addBoard({
        ...formData,
        alerts: alertsArray,
        logs: []
      });
    }
    closeModal();
  };

  const openModal = (board?: Board) => {
    if (board) {
      setEditingId(board.id);
      setFormData({
        name: board.name,
        location: board.location,
        status: board.status,
        voltage: board.voltage,
        current: board.current,
        power: board.power,
        frequency: board.frequency,
        lastInspection: board.lastInspection,
        nextMaintenance: board.nextMaintenance,
        alerts: board.alerts.join("\n")
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este tablero?")) {
      deleteBoard(id);
    }
  };

  const filteredBoards = boards.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="dashboard">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <p style={{ color: "#6b7280" }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/dashboard" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Gestión de Tableros</h1>
          </div>
          <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: "none" }}>
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Buscar tableros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ maxWidth: "300px", marginBottom: 0 }}
          />
          <button onClick={() => openModal()} className="btn-primary" style={{ width: "auto" }}>
            + Agregar Tablero
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "0.5rem", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <thead style={{ background: "#1e3a5f", color: "white" }}>
              <tr>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>ID</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Ubicación</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Voltaje</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Corriente</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Última Inspección</th>
                <th style={{ padding: "0.75rem", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoards.map((board, idx) => (
                <tr key={board.id} style={{ borderBottom: "1px solid #e5e7eb", background: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "600", color: "#1e3a5f" }}>{board.id}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <Link href={`/dashboard/${board.id}`} style={{ color: "#1e3a5f", textDecoration: "none", fontWeight: "500" }}>
                      {board.name}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>{board.location}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span className={`status-badge status-${board.status}`}>
                      <span className="status-dot"></span>
                      {getStatusLabel(board.status)}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>{board.voltage}</td>
                  <td style={{ padding: "0.75rem" }}>{board.current}</td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>{board.lastInspection}</td>
                  <td style={{ padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => openModal(board)}
                        style={{ padding: "0.375rem 0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(board.id)}
                        style={{ padding: "0.375rem 0.75rem", background: "#ef4444", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBoards.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            No se encontraron tableros
          </div>
        )}

        <div style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
          Total de tableros: {filteredBoards.length}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ margin: "0 0 1rem", color: "#1e3a5f" }}>
              {editingId ? "Editar Tablero" : "Agregar Tablero"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Nombre *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ marginBottom: 0 }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Ubicación *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Estado</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "warning" | "inactive" })}
                    style={{ marginBottom: 0 }}
                  >
                    <option value="active">Operativo</option>
                    <option value="warning">Alerta</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Voltaje</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.voltage}
                    onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                    placeholder="400V"
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Corriente</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                    placeholder="250A"
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Potencia</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    placeholder="173kVA"
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Frecuencia</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="50Hz"
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Última Inspección</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.lastInspection}
                    onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
                    style={{ marginBottom: 0 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Próximo Mantenimiento</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.nextMaintenance}
                    onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Alertas (una por línea)</label>
                <textarea
                  className="input-field"
                  value={formData.alerts}
                  onChange={(e) => setFormData({ ...formData, alerts: e.target.value })}
                  placeholder="Alerta 1&#10;Alerta 2"
                  rows={3}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ width: "auto" }}>
                  {editingId ? "Guardar Cambios" : "Agregar Tablero"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
