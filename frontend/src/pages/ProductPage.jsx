import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductHeader from "../components/ProductHeader";
import ProductList from "../components/ProductList";
import { deleteProduct, getProducts } from "../services/productService";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const result = await getProducts();
        if (isActive) {
          setProducts(result);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      isActive = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบสินค้านี้หรือไม่?")) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ProductHeader />
        <div className="flex justify-end">
          <Link className="btn btn-primary" to="/products/new">
            เพิ่มสินค้า
          </Link>
        </div>
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center py-12" role="status">
            <span className="loading loading-spinner loading-lg" />
            <span className="sr-only">กำลังโหลดสินค้า...</span>
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={(product) => navigate(`/products/${product.id}/edit`)}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
      </div>
    </main>
  );
};

export default ProductPage;
