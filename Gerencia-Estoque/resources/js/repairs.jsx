import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';

function Repairs(){
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    const res = await fetch(`/api/repairs?date=${date}`, { headers:{Accept:'application/json'}});
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
          <h1>Manutenções</h1>
          <a className="btn" href="/repairs/create">+ Nova manutenção</a>
        </div>

        <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <button className="btn" onClick={load}>Filtrar</button>
        </div>

        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head"><h2>Lista</h2></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Cliente</th><th>Dispositivo</th><th>Status</th><th>Preço</th><th>Data</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="muted">Carregando...</td></tr>
                ) : items.length===0 ? (
                  <tr><td colSpan="7" className="muted">Nenhuma manutenção no momento.</td></tr>
                ) : items.map(r=>(
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.client}</td>
                    <td>{r.device}</td>
                    <td>{r.status}</td>
                    <td>{r.price ? `R$ ${r.price.toFixed(2).replace('.',',')}` : '-'}</td>
                    <td className="muted">{r.created_at}</td>
                    <td className="action"><a className="link" href={`/repairs/${r.id}`}>Ver</a></td>
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

createRoot(document.getElementById('app')).render(<Repairs />);
