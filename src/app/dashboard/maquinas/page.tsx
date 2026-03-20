"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBoards, type Board, type Component } from "../../layout";

function getStatusLabel(status: string): string {
  switch (status) {
    case "operational": return "Operativo";
    case "warning": return "Alerta";
    case "fault": return "Falla";
    default: return status;
  }
}

interface ComponentWithBoard extends Component {
  boardId: string;
  boardName: string;
}

export default function MaquinasPage() {
  const router = useRouter();
  const { boards } = useBoards();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBoard, setFilterBoard] = useState<string>("all");

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [router, isAuthenticated]);

  const allComponents: ComponentWithBoard[] = boards.flatMap(board => 
    (board.components || []).map(comp => ({
      ...comp,
      boardId: board.id,
      boardName: board.name
    }))
  );

  const filteredComponents = allComponents.filter(comp => {
    const matchesSearch = 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.boardName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || comp.status === filterStatus;
    const matchesBoard = filterBoard === "all" || comp.boardId === filterBoard;
    
    return matchesSearch && matchesStatus && matchesBoard;
  });

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
            <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Registro de Máquinas</h1>
          </div>
          <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: "none" }}>
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Buscar máquinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ maxWidth: "300px", marginBottom: 0 }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
              style={{ marginBottom: 0, minWidth: "150px" }}
            >
              <option value="all">Todos los estados</option>
              <option value="operational">Operativo</option>
              <option value="warning">Alerta</option>
              <option value="fault">Falla</option>
            </select>
            <select
              value={filterBoard}
              onChange={(e) => setFilterBoard(e.target.value)}
              className="input-field"
              style={{ marginBottom: 0, minWidth: "200px" }}
            >
              <option value="all">Todos los tableros</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.name} ({board.id})</option>
              ))}
            </select>
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Total: {filteredComponents.length} máquinas
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "0.5rem", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <thead style={{ background: "#1e3a5f", color: "white" }}>
              <tr>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>ID</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Tipo</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Marca</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Modelo</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Tablero</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Último Mant.</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map((comp, idx) => (
                <tr key={comp.id} style={{ borderBottom: "1px solid #e5e7eb", background: idx % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "0.75rem", fontWeight: "600", color: "#1e3a5f" }}>{comp.id}</td>
                  <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                    <Link href={`/dashboard/${comp.boardId}`} style={{ color: "#1e3a5f", textDecoration: "none" }}>
                      {comp.name}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem", color: "#6b7280" }}>{comp.type}</td>
                  <td style={{ padding: "0.75rem" }}>{comp.brand}</td>
                  <td style={{ padding: "0.75rem" }}>{comp.model}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <Link href={`/dashboard/${comp.boardId}`} style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.875rem" }}>
                      {comp.boardName}
                    </Link>
                  </td>
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
                  <td style={{ padding: "0.75rem", color: "#6b7280", fontSize: "0.875rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={comp.observations}>
                    {comp.observations || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredComponents.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            No se encontraron máquinas
          </div>
        )}
      </div>
    </div>
  );
}
