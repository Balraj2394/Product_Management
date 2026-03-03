import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-content">
            <a href="/" className="nav-brand">
              <span className="nav-logo">📦</span>
              <span className="nav-title">ProductHub</span>
            </a>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add" element={<ProductForm />} />
            <Route path="/edit/:id" element={<ProductForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
