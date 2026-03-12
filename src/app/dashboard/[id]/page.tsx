"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Board {
  id: string;
  name: string;
  location: string;
  status: "active" | "warning" | "inactive";
  voltage: string;
  current: string;
  power: string;
  frequency: string;
  lastInspection: string;
  nextMaintenance: string;
  alerts: string[];
  logs: { date: string; type: "info" | "warning" | "error"; message: string }[];
}

const boardsData: Record<string, Board> = {
  "TB-001": {
    id: "TB-001",
    name: "Tablero Principal",
    location: "Sala Eléctrica - Planta Baja",
    status: "active",
    voltage: "400V",
    current: "250A",
    power: "173kVA",
    frequency: "50Hz",
    lastInspection: "2026-03-10",
    nextMaintenance: "2026-04-10",
    alerts: ["Mantenimiento programado para abril", "Filtros de aire limpiados"],
    logs: [
      { date: "2026-03-12 08:30", type: "info", message: "Inspección diaria completada" },
      { date: "2026-03-10 14:00", type: "info", message: "Mantenimiento preventivo realizado" },
      { date: "2026-03-05 09:15", type: "info", message: "Cambio de filtros de aire" },
    ]
  },
  "TB-002": {
    id: "TB-002",
    name: "Tablero de Distribución A",
    location: "Sector A - Nivel 1",
    status: "active",
    voltage: "400V",
    current: "180A",
    power: "124kVA",
    frequency: "50Hz",
    lastInspection: "2026-03-08",
    nextMaintenance: "2026-04-08",
    alerts: [],
    logs: [
      { date: "2026-03-11 10:00", type: "info", message: "Mediciones dentro de parámetros" },
      { date: "2026-03-08 15:30", type: "info", message: "Inspección completada" },
    ]
  },
  "TB-003": {
    id: "TB-003",
    name: "Tablero de Distribución B",
    location: "Sector B - Nivel 1",
    status: "warning",
    voltage: "395V",
    current: "165A",
    power: "114kVA",
    frequency: "50Hz",
    lastInspection: "2026-03-05",
    nextMaintenance: "2026-03-20",
    alerts: ["Sobrecarga detectada en fase C", "Revisar conexión"],
    logs: [
      { date: "2026-03-12 11:45", type: "warning", message: "Sobrecarga detectada en fase C" },
      { date: "2026-03-12 11:40", type: "warning", message: "Temperatura elevada en interruptor principal" },
      { date: "2026-03-05 09:00", type: "info", message: "Inspección de rutina" },
    ]
  },
  "TB-004": {
    id: "TB-004",
    name: "Tablero de Emergencia",
    location: "Sala de Emergencias",
    status: "active",
    voltage: "400V",
    current: "45A",
    power: "31kVA",
    frequency: "50Hz",
    lastInspection: "2026-03-12",
    nextMaintenance: "2026-04-12",
    alerts: ["Prueba de transferencia exitosa"],
    logs: [
      { date: "2026-03-12 06:00", type: "info", message: "Prueba de transferencia automática exitosa" },
      { date: "2026-03-11 22:00", type: "info", message: "Sistema en modo standby" },
    ]
  },
  "TB-005": {
    id: "TB-005",
    name: "Tablero de Iluminación",
    location: "Pasillo Central",
    status: "active",
    voltage: "230V",
    current: "32A",
    power: "7.4kW",
    frequency: "50Hz",
    lastInspection: "2026-03-01",
    nextMaintenance: "2026-04-01",
    alerts: [],
    logs: [
      { date: "2026-03-10 18:00", type: "info", message: "Horario de iluminación verificado" },
    ]
  },
  "TB-006": {
    id: "TB-006",
    name: "Tablero de Motores",
    location: "Sala de Máquinas",
    status: "inactive",
    voltage: "0V",
    current: "0A",
    power: "0kW",
    frequency: "50Hz",
    lastInspection: "2026-02-28",
    nextMaintenance: "2026-03-15",
    alerts: ["Fuera de servicio por mantenimiento", "Esperando repuesto"],
    logs: [
      { date: "2026-03-01 08:00", type: "error", message: "Sistema desconectado para mantenimiento" },
      { date: "2026-02-28 16:30", type: "warning", message: "Detección de falla en motor principal" },
    ]
  },
  "TB-007": {
    id: "TB-007",
    name: "Tablero de Climatización",
    location: "Sala Técnica - Techo",
    status: "warning",
    voltage: "400V",
    current: "95A",
    power: "66kVA",
    frequency: "50Hz",
    lastInspection: "2026-03-09",
    nextMaintenance: "2026-03-25",
    alerts: ["Filtro obstruido", "Revisar consumo"],
    logs: [
      { date: "2026-03-12 07:30", type: "warning", message: "Filtro de aire parcialmente obstruido" },
      { date: "2026-03-09 11:00", type: "info", message: "Inspección de sistemas de climatización" },
    ]
  },
  "TB-008": {
    id: "TB-008",
    name: "Tablero de UPS",
    location: "Sala de Servidores",
    status: "active",
    voltage: "230V",
    current: "28A",
    power: "6.4kW",
    frequency: "50Hz",
    lastInspection: "2026-03-11",
    nextMaintenance: "2026-04-11",
    alerts: ["Baterías al 95%"],
    logs: [
      { date: "2026-03-12 00:00", type: "info", message: "Carga de baterías al 95%" },
      { date: "2026-03-11 12:00", type: "info", message: "Sistema funcionando correctamente" },
    ]
  },
};

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
  const boardId = params.id as string;
  const board = boardId ? boardsData[boardId] : null;
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
              <span className="info-value">{board.nextMaintenance}</span>
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
              {board.alerts.map((alert, idx) => (
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
            {board.logs.map((log, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
