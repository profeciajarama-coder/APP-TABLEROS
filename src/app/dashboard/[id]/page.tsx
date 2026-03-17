"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useBoards, type Board, type Component } from "../../layout";

function getStatusLabel(status: string): string {
  switch (status) {
    case "active": return "Operativo";
    case "warning": return "Alerta";
    case "inactive": return "Inactivo";
    case "operational": return "Operativo";
    case "fault": return "Falla";
    default: return status;
  }
}

function getComponentStatusClass(status: string): string {
  switch (status) {
    case "operational": return "status-active";
    case "warning": return "status-warning";
    case "fault": return "status-inactive";
    default: return "";
  }
}

interface ComponentFormData {
  name: string;
  type: string;
  brand: string;
  model: string;
  status: "operational" | "warning" | "fault";
  lastMaintenance: string;
  observations: string;
}

const emptyComponentForm: ComponentFormData = {
  name: "",
  type: "",
  brand: "",
  model: "",
  status: "operational",
  lastMaintenance: new Date().toISOString().split("T")[0],
  observations: ""
};

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { boards, updateBoard } = useBoards();
  const boardId = params.id as string;
  const board = boards.find((b: Board) => b.id === boardId);
  
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [componentForm, setComponentForm] = useState<ComponentFormData>(emptyComponentForm);
  
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [router, isAuthenticated]);

  const handleSaveComponent = () => {
    if (!board) return;
    
    const existingComponents = board.components || [];
    
    if (editingComponent) {
      const updatedComponents = existingComponents.map(c => 
        c.id === editingComponent.id 
          ? { ...c, ...componentForm }
          : c
      );
      updateBoard(boardId, { components: updatedComponents });
    } else {
      const newId = `COMP-${String(existingComponents.length + 1).padStart(3, "0")}`;
      const newComponent: Component = { id: newId, ...componentForm };
      updateBoard(boardId, { components: [...existingComponents, newComponent] });
    }
    
    setShowComponentModal(false);
    setEditingComponent(null);
    setComponentForm(emptyComponentForm);
  };

  const handleDeleteComponent = (componentId: string) => {
    if (!board) return;
    if (confirm("¿Está seguro de eliminar este componente?")) {
      const updatedComponents = board.components.filter(c => c.id !== componentId);
      updateBoard(boardId, { components: updatedComponents });
    }
  };

  const openComponentModal = (component?: Component) => {
    if (component) {
      setEditingComponent(component);
      setComponentForm({
        name: component.name,
        type: component.type,
        brand: component.brand,
        model: component.model,
        status: component.status,
        lastMaintenance: component.lastMaintenance,
        observations: component.observations
      });
    } else {
      setEditingComponent(null);
      setComponentForm(emptyComponentForm);
    }
    setShowComponentModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link href="/dashboard" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </Link>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link href="/dashboard" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Volver
            </Link>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Tablero no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-header">
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/dashboard" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.25rem" }}>{board.name}</h1>
              <p style={{ margin: 0, opacity: 0.8, fontSize: "0.875rem" }}>{board.id}</p>
            </div>
          </div>
          <span className={`status-badge status-${board.status}`}>
            <span className="status-dot"></span>
            {getStatusLabel(board.status)}
          </span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-section">
            <h3>Información General</h3>
            <div className="info-row">
              <span className="info-label">Nombre</span>
              <span className="info-value">{board.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">ID</span>
              <span className="info-value">{board.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ubicación</span>
              <span className="info-value">{board.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Última Inspección</span>
              <span className="info-value">{board.lastInspection}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Próximo Mantenimiento</span>
              <span className="info-value">{board.nextMaintenance || "No programada"}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-section">
            <h3>Parámetros Eléctricos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Voltaje</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1.25rem", fontWeight: "700", color: "#1e3a5f" }}>{board.voltage}</p>
              </div>
              <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Corriente</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1.25rem", fontWeight: "700", color: "#1e3a5f" }}>{board.current}</p>
              </div>
              <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Potencia</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1.25rem", fontWeight: "700", color: "#1e3a5f" }}>{board.power}</p>
              </div>
              <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Frecuencia</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1.25rem", fontWeight: "700", color: "#1e3a5f" }}>{board.frequency}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ margin: 0 }}>Componentes ({board.components?.length || 0})</h3>
              <button 
                onClick={() => openComponentModal()}
                style={{ 
                  padding: "0.5rem 1rem", 
                  background: "#1e3a5f", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "0.375rem", 
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                + Agregar
              </button>
            </div>
            
            {board.components && board.components.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Nombre</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Tipo</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Marca</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Modelo</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Estado</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Último Mant.</th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontWeight: "600" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.components.map((comp) => (
                      <tr key={comp.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "0.75rem", fontWeight: "500" }}>{comp.name}</td>
                        <td style={{ padding: "0.75rem", color: "#6b7280" }}>{comp.type}</td>
                        <td style={{ padding: "0.75rem" }}>{comp.brand}</td>
                        <td style={{ padding: "0.75rem" }}>{comp.model}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <span style={{
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            background: comp.status === "operational" ? "#d1fae5" : comp.status === "warning" ? "#fef3c7" : "#fee2e2",
                            color: comp.status === "operational" ? "#065f46" : comp.status === "warning" ? "#92400e" : "#991b1b"
                          }}>
                            {getStatusLabel(comp.status)}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem", color: "#6b7280" }}>{comp.lastMaintenance}</td>
                        <td style={{ padding: "0.75rem", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "0.25rem" }}>
                            <button
                              onClick={() => openComponentModal(comp)}
                              style={{ padding: "0.25rem 0.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteComponent(comp.id)}
                              style={{ padding: "0.25rem 0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem" }}
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
            ) : (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "1rem" }}>
                No hay componentes registrados
              </p>
            )}
          </div>
        </div>

        {board.alerts.length > 0 && (
          <div className="detail-card">
            <div className="detail-section">
              <h3>Alertas</h3>
              {board.alerts.map((alert: string, idx: number) => (
                <div key={idx} style={{ 
                  padding: "0.75rem", 
                  background: "#fef3c7", 
                  borderRadius: "0.5rem", 
                  marginBottom: "0.5rem",
                  borderLeft: "3px solid #f59e0b"
                }}>
                  {alert}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-card">
          <div className="detail-section">
            <h3>Historial de Eventos</h3>
            {board.logs && board.logs.length > 0 ? (
              board.logs.map((log: Board["logs"][number], idx: number) => (
                <div key={idx} className={`log-entry ${log.type}`}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "500" }}>
                      {log.type === "error" && "Error"}
                      {log.type === "warning" && "Advertencia"}
                      {log.type === "info" && "Información"}
                    </span>
                    <span className="log-date">{log.date}</span>
                  </div>
                  <p style={{ margin: "0.25rem 0 0", color: "#374151" }}>{log.message}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280", textAlign: "center" }}>No hay eventos registrados</p>
            )}
          </div>
        </div>
      </div>

      {showComponentModal && (
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
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <h2 style={{ margin: "0 0 1rem", color: "#1e3a5f" }}>
              {editingComponent ? "Editar Componente" : "Agregar Componente"}
            </h2>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Nombre *</label>
                <input
                  type="text"
                  className="input-field"
                  value={componentForm.name}
                  onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Tipo *</label>
                <input
                  type="text"
                  className="input-field"
                  value={componentForm.type}
                  onChange={(e) => setComponentForm({ ...componentForm, type: e.target.value })}
                  placeholder="Interruptor, Contactor, etc."
                  required
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Marca</label>
                  <input
                    type="text"
                    className="input-field"
                    value={componentForm.brand}
                    onChange={(e) => setComponentForm({ ...componentForm, brand: e.target.value })}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Modelo</label>
                  <input
                    type="text"
                    className="input-field"
                    value={componentForm.model}
                    onChange={(e) => setComponentForm({ ...componentForm, model: e.target.value })}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Estado</label>
                <select
                  className="input-field"
                  value={componentForm.status}
                  onChange={(e) => setComponentForm({ ...componentForm, status: e.target.value as "operational" | "warning" | "fault" })}
                  style={{ marginBottom: 0 }}
                >
                  <option value="operational">Operativo</option>
                  <option value="warning">Alerta</option>
                  <option value="fault">Falla</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Último Mantenimiento</label>
                <input
                  type="date"
                  className="input-field"
                  value={componentForm.lastMaintenance}
                  onChange={(e) => setComponentForm({ ...componentForm, lastMaintenance: e.target.value })}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500", fontSize: "0.875rem" }}>Observaciones</label>
                <textarea
                  className="input-field"
                  value={componentForm.observations}
                  onChange={(e) => setComponentForm({ ...componentForm, observations: e.target.value })}
                  rows={3}
                  style={{ marginBottom: 0 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button 
                type="button" 
                onClick={() => { setShowComponentModal(false); setEditingComponent(null); setComponentForm(emptyComponentForm); }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleSaveComponent}
                className="btn-primary"
                style={{ width: "auto" }}
              >
                {editingComponent ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
