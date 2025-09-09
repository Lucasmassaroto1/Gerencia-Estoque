import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import api from "./lib/api.js";
import "../css/home.css";

function Home() {
  const [loading, setLoading] = useState(true);
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

    (async () => {
      setLoading(true);
      setError("");

      try {
        const [mRes, lRes] = await Promise.all([
          api.get("/dashboard"),
          api.get("/products", { params: { low: 1, per_page: 5 } }),
        ]);
        if (canceled) return;

        const m = mRes.data ?? {};
        const list = Array.isArray(lRes.data?.data) ? lRes.data.data : [];

        setMetrics({
          salesToday: Number(m.salesToday || 0),
          repairsToday: Number(m.repairsToday || 0),
          revenueToday: Number(m.revenueToday || 0),
          lowStockCount: Number(m.lowStockCount || 0),
        });
        setLowStock(list);
      } catch (err) {
        if (canceled) return;

        // NÃO redireciona. Só informa o erro.
        const status = err?.response?.status;
        const msg =
          status === 401
            ? "Não autenticado. Faça login para ver os dados."
            : status === 404
            ? "API não encontrada (verifique a rota /api/v1)."
            : "Não foi possível carregar os dados agora.";
        setError(msg);

        // zera telas
        setMetrics({ salesToday: 0, repairsToday: 0, revenueToday: 0, lowStockCount: 0 });
        setLowStock([]);

        // ajuda na inspeção
        console.log("Dashboard error:", {
          status,
          data: err?.response?.data,
          url: err?.config?.url,
          baseURL: err?.config?.baseURL,
        });
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => { canceled = true; };
  }, []);

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">
        <div className="title-row">
          <h1>Dashboard</h1>
        </div>

        {error && <div className="alert">{error}</div>}

        <section className="grid-cards">
          <div className="card">
            <div className="card-label">Vendas (hoje)</div>
            <div className="card-value">{loading ? "..." : metrics.salesToday}</div>
          </div>

          <div className="card">
            <div className="card-label">Manutenções (hoje)</div>
            <div className="card-value">{loading ? "..." : metrics.repairsToday}</div>
          </div>

          <div className="card">
            <div className="card-label">Faturado (hoje)</div>
            <div className="card-value">
              {loading ? "..." : `R$ ${Number(metrics.revenueToday).toFixed(2).replace(".", ",")}`}
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