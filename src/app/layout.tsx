"use client";

import { useState, useEffect, createContext, useContext } from "react";
import "./globals.css";

export interface Board {
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

const defaultBoards: Board[] = [
  {
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
    alerts: ["Mantenimiento programado para abril"],
    logs: [{ date: "2026-03-12 08:30", type: "info", message: "Inspección diaria completada" }]
  },
  {
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
    logs: []
  },
  {
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
    alerts: ["Sobrecarga detectada en fase C"],
    logs: [{ date: "2026-03-12 11:45", type: "warning", message: "Sobrecarga detectada" }]
  },
  {
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
    logs: []
  },
  {
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
    logs: []
  },
  {
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
    alerts: ["Fuera de servicio por mantenimiento"],
    logs: []
  },
  {
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
    alerts: ["Filtro obstruido"],
    logs: []
  },
  {
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
    logs: []
  }
];

interface BoardContextType {
  boards: Board[];
  addBoard: (board: Omit<Board, "id">) => void;
  updateBoard: (id: string, board: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

export function useBoards() {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoards must be used within BoardProvider");
  return context;
}

function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(() => {
    if (typeof window === "undefined") return defaultBoards;
    const stored = localStorage.getItem("boards");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultBoards;
      }
    }
    localStorage.setItem("boards", JSON.stringify(defaultBoards));
    return defaultBoards;
  });

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const addBoard = (board: Omit<Board, "id">) => {
    const newId = `TB-${String(boards.length + 1).padStart(3, "0")}`;
    const logs = board.logs || [];
    setBoards([...boards, { ...board, id: newId, logs }]);
  };

  const updateBoard = (id: string, updates: Partial<Board>) => {
    setBoards(boards.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBoard = (id: string) => {
    setBoards(boards.filter(b => b.id !== id));
  };

  return (
    <BoardContext.Provider value={{ boards, addBoard, updateBoard, deleteBoard }}>
      {children}
    </BoardContext.Provider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <BoardProvider>{children}</BoardProvider>
      </body>
    </html>
  );
}
