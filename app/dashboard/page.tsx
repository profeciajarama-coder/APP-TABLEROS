"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Board {
  id: string;
  name: string;
  location: string;
  status: "active" | "warning" | "inactive";
  voltage: string;
  current: string;
  lastInspection: string;
  alerts: string[];
}

const boardsData: Board[] = [
  {
    id: "TB-001",
    name: "Tablero Principal",
    location: "Sala Eléctrica - Planta Baja",
    status: "active",
    voltage: "400V",
    current: "250A",
    lastInspection: "2026-03-10",
    alerts: ["Mantenimiento programado para abril", "Filtros de aire limpiados"]
  },
  {
    id: "TB-002",
    name: "Tablero de Distribución A",
    location: "Sector A - Nivel 1",
    status: "active",
    voltage: "400V",
    current: "180A",
    lastInspection: "2026-03-08",
    alerts: []
  },
  {
    id: "TB-003",
    name: "Tablero de Distribución B",
    location: "Sector B - Nivel 1",
    status: "warning",
    voltage: "395V",
    current: "165A",
    lastInspection: "2026-03-05",
    alerts: ["Sobrecarga detectada en fase C", "Revisar conexión"]
  },
  {
    id: "TB-004",
    name: "Tablero de Emergencia",
    location: "Sala de Emergencias",
    status: "active",
    voltage: "400V",
    current: "45A",
    lastInspection: "2026-03-12",
    alerts: ["Prueba de transferencia exitosa"]
  },
  {
    id: "TB-005",
    name: "Tablero de Iluminación",
    location: "Pasillo Central",
    status: "active",
    voltage: "230V",
    current: "32A",
    lastInspection: "2026-03-01",
    alerts: []
  },
  {
    id: "TB-006",
    name: "Tablero de Motores",
    location: "Sala de Máquinas",
    status: "inactive",
    voltage: "0V",
    current: "0A",
    lastInspection: "2026-02-28",
    alerts: ["Fuera de servicio por mantenimiento", "Esperando repuesto"]
  },
  {
    id: "TB-007",
    name: "Tablero de Climatización",
    location: "Sala Técnica - Techo",
    status: "warning",
    voltage: "400V",
    current: "95A",
    lastInspection: "2026-03-09",
    alerts: ["Filtro obstruido", "Revisar consumo"]
  },
  {
    id: "TB-008",
    name: "Tablero deUPS",
    location: "Sala de Servidores",
    status: "active",
    voltage: "230V",
    current: "28A",
    lastInspection: "2026-03-11",
    alerts: ["Baterías al 95%"]
  }
];

function getStatusLabel(status: string): string {
  switch (status) {
    case "active": return "Operativo";
    case "warning": return "Alerta";
    case "inactive": return "Inactivo";
    default: return status;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [boards] = useState<Board[]>(boardsData);
  const [filter, setFilter] = useState<string>("all");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.replace("/");
  };

  const filteredBoards = filter === "all" 
    ? boards 
    : boards.filter(b => b.status === filter);

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [router, isAuthenticated]);

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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Control de Tableros Eléctricos</h1>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "1rem",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setFilter("all")}
          className="btn-secondary"
          style={{ 
            background: filter === "all" ? "#1e3a5f" : "#e5e7eb",
            color: filter === "all" ? "white" : "#374151"
          }}
        >
          Todos ({boards.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className="btn-secondary"
          style={{ 
            background: filter === "active" ? "#166534" : "#e5e7eb",
            color: filter === "active" ? "white" : "#374151"
          }}
        >
          Operativos ({boards.filter(b => b.status === "active").length})
        </button>
        <button
          onClick={() => setFilter("warning")}
          className="btn-secondary"
          style={{ 
            background: filter === "warning" ? "#92400e" : "#e5e7eb",
            color: filter === "warning" ? "white" : "#374151"
          }}
        >
          Alertas ({boards.filter(b => b.status === "warning").length})
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className="btn-secondary"
          style={{ 
            background: filter === "inactive" ? "#991b1b" : "#e5e7eb",
            color: filter === "inactive" ? "white" : "#374151"
          }}
        >
          Inactivos ({boards.filter(b => b.status === "inactive").length})
        </button>
      </div>

      <div className="boards-grid">
        {filteredBoards.map((board) => (
          <Link href={`/dashboard/${board.id}`} key={board.id} style={{ textDecoration: "none" }}>
            <div className="board-card scrollable">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ margin: 0, color: "#1e3a5f", fontSize: "1rem", fontWeight: "600" }}>
                    {board.name}
                  </h3>
                  <p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.875rem" }}>
                    {board.id}
                  </p>
                </div>
                <span className={`status-badge status-${board.status}`}>
                  <span className="status-dot"></span>
                  {getStatusLabel(board.status)}
                </span>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <p style={{ margin: 0, color: "#374151", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {board.location}
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ background: "#f9fafb", padding: "0.5rem", borderRadius: "0.375rem" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Voltaje</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>{board.voltage}</p>
                </div>
                <div style={{ background: "#f9fafb", padding: "0.5rem", borderRadius: "0.375rem" }}>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Corriente</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>{board.current}</p>
                </div>
              </div>

              {board.alerts.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "#92400e", fontWeight: "600" }}>
                    Alertas ({board.alerts.length})
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.75rem", color: "#6b7280" }}>
                    {board.alerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p style={{ margin: "0.75rem 0 0", fontSize: "0.75rem", color: "#9ca3af", textAlign: "right" }}>
                Última inspección: {board.lastInspection}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredBoards.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          No hay tableros con este filtro
        </div>
      )}
    </div>
  );
}
