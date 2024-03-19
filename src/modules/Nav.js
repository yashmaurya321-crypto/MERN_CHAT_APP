import React from 'react';
import './nav.css';

function Nav() {
  return (
    <nav>
      <a href="/" className="hover-line">Dashbord</a>
      <a href="/find" className="hover-line">Find </a>
      <a href="/request" className="hover-line">Request</a>
    </nav>
  );
}

export default Nav;