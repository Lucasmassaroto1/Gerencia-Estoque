import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';
import '../css/produtoModal.css';

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
          {/* <a className="btn" href="/products/create">+ Novo produto</a> */}
        </div>

        <div style={{marginTop:12, display:'flex', gap:8}}>
          <input placeholder="Buscar por nome ou SKU..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && load()}/>
          <button className="btn" onClick={load}>Buscar</button>
          <a className="btn" href="/products?f=low">Baixo estoque</a>
        </div>

        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head"><h2>Lista</h2>
            
            {/* INICIO ABRE MODAL */}
            <div className="actions">
              <a href="#novo-produto" className="btn primary">
                + Novo produto
              </a>
            </div>
            {/* FIM ABRE MODAL */}

          </div>
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

         {/* ======= Bloco do modal CSS-only ======= */}
        <section id="novo-produto" className="modal" aria-labelledby="titulo-modal" aria-modal="true" role="dialog">
          <a href="#" className="modal__overlay" aria-label="Fechar"></a>

          <div className="modal__panel">
            <a className="modal__close" href="#" aria-label="Fechar">
              ✕
            </a>
            <h2 id="titulo-modal" className="modal__title">
              Adicionar produto
            </h2>
            <p className="modal__desc">Preencha os campos abaixo e salve.</p>

            <form method="post" action="/products">
              <div className="grid">
                <div className="field" style={{ gridColumn: "span 12" }}>
                  <label htmlFor="produto">Produto</label>
                  <input id="produto" name="produto" type="text" placeholder="Ex.: Teclado Mecânico RGB" required/>
                  <span className="helper">Nome comercial para identificação.</span>
                </div>

                <div className="field half">
                  <label htmlFor="sku">SKU</label>
                  <input id="sku" name="sku" type="text" placeholder="Ex.: TEC-RGB-87" required/>
                </div>
                <div className="field half">
                  <label htmlFor="categoria">Categoria</label>
                  <select id="categoria" name="categoria" required defaultValue="">
                    <option value="" disabled>
                      Selecione...
                    </option>
                    <option>Periféricos</option>
                    <option>Hardware</option>
                    <option>Acessórios</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="field third">
                  <label htmlFor="estoque">Estoque</label>
                  <input id="estoque" name="estoque" type="number" min="0" step="1" placeholder="0" required/>
                </div>
                <div className="field third">
                  <label htmlFor="minimo">Mínimo</label>
                  <input id="minimo" name="minimo" type="number" min="0" step="1" placeholder="5" required/>
                </div>
                <div className="field third">
                  <label htmlFor="preco">Preço</label>
                  <input id="preco" name="preco" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0,00" required/>
                </div>
              </div>

              <div className="form__actions">
                <a href="#" className="btn">
                  Cancelar
                </a>
                <button type="submit" className="btn primary">
                  Salvar
                </button>
              </div>
            </form>

          </div>
        </section>
        {/* ======= /modal ======= */}
      </main>
    </div>
  );
}

createRoot(document.getElementById("app")).render(<Products />);