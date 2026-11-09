import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrdersPage } from '../features/orders/OrdersPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Order Management System</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </Router>
  );
};

export default App;