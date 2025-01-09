import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'
import BookMaintain from './BookMaintain'

const root = ReactDOM.createRoot(document.getElementById('root'));

const vm={
  "BookName":"",
  "BookAuthor":""
}

root.render(

  <><header>
    <nav className="navbar">
      <h1 className="navbar-title text-center">圖書管理系統</h1>
    </nav>
  </header>
    <main>
      <BookMaintain></BookMaintain>
    </main></>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
