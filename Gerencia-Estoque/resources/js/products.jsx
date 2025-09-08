import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';

function Products(){
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    const res = await fetch(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ""}`, { headers:{Accept:'application/json'}});
    const data = await res.json();
    setItems(Array.isArray(data?.data)? data.data : []);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">
        <div className="title-row">
          <h1>Produtos</h1>
          <a className="btn" href="/products/create">+ Novo produto</a>
        </div>

        <div style={{marginTop:12, display:'flex', gap:8}}>
          <input placeholder="Buscar por nome ou SKU..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && load()}/>
          <button className="btn" onClick={load}>Buscar</button>
          <a className="btn" href="/products?f=low">Baixo estoque</a>
        </div>

        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head"><h2>Lista</h2></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th><th>SKU</th><th>Categoria</th>
                  <th className="right">Estoque</th><th className="right">Mínimo</th><th className="right">Preço</th><th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="muted">Carregando...</td></tr>
                ) : items.length===0 ? (
                  <tr><td colSpan="7" className="muted">Nenhum registro.</td></tr>
                ) : items.map(p=>(
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="muted">{p.sku}</td>
                    <td>{p.category || '-'}</td>
                    <td className="right">{p.stock}</td>
                    <td className="right">{p.min_stock}</td>
                    <td className="right">{p.sale_price ? `R$ ${p.sale_price.toFixed(2).replace('.',',')}` : '-'}</td>
                    <td className="action"><a className="link" href={`/products/${p.id}/edit`}>Editar</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<Products />);
