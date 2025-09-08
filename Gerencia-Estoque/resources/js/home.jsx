import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';

function Home() {
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState("");

  const [metrics, setMetrics] = useState({
    salesToday: 0,
    repairsToday: 0,
    revenueToday: 0,
    lowStockCount: 0,
  });

  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [mRes, lRes] = await Promise.all([
          fetch("/api/dashboard", {
            headers: { Accept: "application/json" },
          }),
          fetch("/api/products?low=1&limit=5", {
            headers: { Accept: "application/json" },
          }),
        ]);

        // Se não existir API ainda, cai em demo
        if (!mRes.ok || !lRes.ok) throw new Error("API indisponível");

        const mData = await mRes.json();
        const lData = await lRes.json();

        if (!canceled) {
          setMetrics({
            salesToday: mData?.salesToday ?? 0,
            repairsToday: mData?.repairsToday ?? 0,
            revenueToday: mData?.revenueToday ?? 0,
            lowStockCount: mData?.lowStockCount ?? 0,
          });
          setLowStock(Array.isArray(lData?.data) ? lData.data : (Array.isArray(lData) ? lData : []));
        }
      } catch (e) {
        if (!canceled) {
          setDemoMode(true);
          setMetrics({
            salesToday: 3,
            repairsToday: 2,
            revenueToday: 1299.9,
            lowStockCount: 4,
          });
          setLowStock([
            { id: 1, name: "SSD 1TB NVMe", sku: "SSD-1TB-NVME", stock: 2, min_stock: 3, category: "armazenamento" },
            { id: 2, name: "Memória 16GB DDR4", sku: "RAM-16-DDR4", stock: 1, min_stock: 5, category: "memória" },
            { id: 3, name: "Fonte 600W 80+ Bronze", sku: "PSU-600B", stock: 0, min_stock: 2, category: "energia" },
            { id: 4, name: "Cabo HDMI 2.1", sku: "HDMI-21", stock: 5, min_stock: 8, category: "acessórios" },
          ]);
          setError("API não encontrada. Exibindo dados de demonstração.");
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => { canceled = true; };
  }, []);

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">
        <div className="title-row">
          <h1>Dashboard</h1>
          {demoMode && <span className="badge">Demo mode</span>}
        </div>

        {error && (
          <div className="alert">
            {error}
          </div>
        )}

        <section className="grid-cards">
          <div className="card">
            <div className="card-label">Vendas (hoje)</div>
            <div className="card-value">{loading ? "..." : metrics.salesToday}</div>
          </div>

          <div className="card">
            <div className="card-label">Consertos (hoje)</div>
            <div className="card-value">{loading ? "..." : metrics.repairsToday}</div>
          </div>

          <div className="card">
            <div className="card-label">Faturado (hoje)</div>
            <div className="card-value">
              {loading ? "..." : `R$ ${metrics.revenueToday.toFixed(2).replace('.', ',')}`}
            </div>
          </div>

          <div className={`card ${metrics.lowStockCount > 0 ? "danger" : ""}`}>
            <div className="card-label">Itens com baixo estoque</div>
            <div className="card-value">{loading ? "..." : metrics.lowStockCount}</div>
            {metrics.lowStockCount > 0 && (
              <a className="card-link" href="/products?f=low">ver todos</a>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Baixo estoque</h2>
            <a className="btn" href="/products?create=1">+ Novo produto</a>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th className="right">Estoque</th>
                  <th className="right">Mínimo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="muted">Carregando...</td></tr>
                ) : lowStock.length === 0 ? (
                  <tr><td colSpan="6" className="muted">Nenhum item no momento.</td></tr>
                ) : (
                  lowStock.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="muted">{p.sku}</td>
                      <td>{p.category || "-"}</td>
                      <td className="right">{p.stock}</td>
                      <td className="right">{p.min_stock}</td>
                      <td className="action">
                        <a className="link" href={`/products/${p.id}/edit`}>Editar</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("app")).render(<Home />);
