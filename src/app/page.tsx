"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      router.push("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem"
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h1 style={{ color: "#1e3a5f", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
            Control de Tableros
          </h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
            Ingrese sus credenciales
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151", fontWeight: "500" }}>
              Usuario
            </label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese usuario"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151", fontWeight: "500" }}>
              Contraseña
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese contraseña"
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: "#dc2626", 
              background: "#fee2e2", 
              padding: "0.75rem", 
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary">
            Ingresar
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", color: "#9ca3af", fontSize: "0.875rem" }}>
          Demo: admin / admin123
        </p>
      </div>
    </div>
  );
}
