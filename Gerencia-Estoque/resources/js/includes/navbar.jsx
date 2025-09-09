import React from 'react';

export default function Navbar(){
  return(
    <header className="topbar">
      <div className="brand">
        <span className="logo-dot" /> <strong>Armazium</strong>
      </div>
      <nav className="nav">
        <a href="/">Dashboad</a>
        <a href="/products">Produtos</a>
        <a href="/clients">Clientes</a>
        <a href="/sales">Vendas</a>
        <a href="/repairs">Manutenções</a>
        <a href="/login" className="logout">Sair</a>
      </nav>
    </header>
  )
}