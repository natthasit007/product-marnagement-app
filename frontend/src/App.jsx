import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import ProductPage from "./pages/ProductPage.jsx";
import AddProductPage from "./pages/AddProductPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/products/:id/edit" element={<EditProductPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
