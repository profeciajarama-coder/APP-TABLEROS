"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useBoards, type Board } from "../../layout";

function getStatusLabel(status: string): string {
  switch (status) {
    case "active": return "Operativo";
    case "warning": return "Alerta";
    case "inactive": return "Inactivo";
    default: return status;
  }
}

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { boards } = useBoards();
  const boardId = params.id as string;
  const board = boards.find((b: Board) => b.id === boardId);
  
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [router, isAuthenticated]);

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
    </div>
  );
}
