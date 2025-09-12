import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';
import '../css/produtoModal.css';

function Clients(){
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", phone:"", notes:"" });

  async function load(next = {}) {
    const qParam = next.q ?? q;
    setLoading(true);
    const qs = new URLSearchParams();
    if (qParam) qs.set("q", qParam);

    const res = await fetch(`/clients/list${qs.toString() ? `?${qs}` : ""}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    setItems(Array.isArray(data?.data) ? data.data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // helpers modal
  function startCreate(){
    setMode("create");
    setEditingId(null);
    setForm({ name:"", email:"", phone:"", notes:"" });
  }
  function startEdit(c){
    setMode("edit");
    setEditingId(c.id);
    setForm({
      name: c.name ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
      notes: c.notes ?? "",
    });
  }
  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">

        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head">
            <div className="title-row">
              <h1>Clientes</h1>
              <input placeholder="Buscar por nome, e-mail ou telefone..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && load({ q })} style={{width: 251}}/>
              <button className="btn" onClick={() => load({ q })}>Buscar</button>
            </div>
            <a href="#novo-cliente" className="btn primary" onClick={startCreate}>+ Cadastrar cliente</a>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Email</th><th>Telefone</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="muted">Carregando...</td></tr>
                ) : items.length===0 ? (
                  <tr><td colSpan="4" className="muted">Nenhum registro.</td></tr>
                ) : items.map(c=>(
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="muted">{c.email || '-'}</td>
                    <td>{c.phone || '-'}</td>
                    <td className="action">
                      <a className="link" href="#novo-cliente" onClick={() => startEdit(c)}>Editar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ======= Modal CSS-only (criar, editar e excluir) ======= */}
        <section id="novo-cliente" className="modal" aria-labelledby="titulo-modal" aria-modal="true" role="dialog">
          <a href="#" className="modal__overlay" aria-label="Fechar"></a>

          <div className="modal__panel">
            <a className="modal__close" href="#" aria-label="Fechar">✕</a>

            <h2 id="titulo-modal" className="modal__title">
              {mode === "edit" ? "Editar cliente" : "Adicionar cliente"}
            </h2>
            <p className="modal__desc">
              {mode === "edit" ? "Atualize os dados e salve." : "Preencha os campos abaixo e salve."}
            </p>

            {/* Action dinâmica + method spoof quando editar */}
            <form method="post" action={mode === "edit" ? `/clients/${editingId}` : "/clients"}>
              <input type="hidden" name="_token" value={window.csrfToken}/>
              {mode === "edit" && <input type="hidden" name="_method" value="PUT" />}

              <div className="grid">
                <div className="field">
                  <label htmlFor="name">Nome</label>
                  <input id="name" name="name" type="text" placeholder="Ex.: Lucas Silva" required value={form.name} onChange={e=>setField("name", e.target.value)}/>
                </div>

                <div className="field half">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e=>setField("email", e.target.value)}/>
                </div>

                <div className="field half">
                  <label htmlFor="phone">Telefone</label>
                  <input id="phone" name="phone" type="text" placeholder="(00) 00000-0000"value={form.phone} onChange={e=>setField("phone", e.target.value)}/>
                </div>

                <div className="field" >
                  <label htmlFor="notes">Observações</label>
                  <input id="notes" name="notes" type="text" placeholder="Anotações do cliente" value={form.notes} onChange={e=>setField("notes", e.target.value)}/>
                </div>
              </div>

              <div className="form__actions">
                {/* Form EXCLUIR aparece só em modo edição */}
                {mode === "edit" && (
                  <form method="post" action={`/clients/${editingId}`} onSubmit={(e)=>{ if(!confirm("Tem certeza que deseja excluir este cliente?")) e.preventDefault(); }}>
                    <input type="hidden" name="_token" value={window.csrfToken}/>
                    <input type="hidden" name="_method" value="DELETE"/>
                    <button type="submit" className="btn danger">Excluir</button>
                  </form>
                )}

                <a href="#" className="btn">Cancelar</a>
                <button type="submit" className="btn primary">
                  {mode === "edit" ? "Salvar alterações" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </section>
        {/* ======= /Modal ======= */}
      </main>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<Clients />);