import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthModal } from './components/AuthModal';
import { Index } from './pages/Index';
import { Catalogue } from './pages/Catalogue';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Account } from './pages/Account';
import { Orders } from './pages/Orders';
import { Favorites } from './pages/Favorites';
import { Success } from './pages/Success';
import { Cancel } from './pages/Cancel';
import { NotFound } from './pages/NotFound';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onAuthClick={() => setAuthOpen(true)} />}>
          <Route index element={<Index />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="categorie/:slug" element={<Category />} />
          <Route path="produit/:id" element={<ProductDetail />} />
          <Route path="panier" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="account/commandes" element={<Orders />} />
          <Route path="account/favoris" element={<Favorites />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </BrowserRouter>
  );
}
