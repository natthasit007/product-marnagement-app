import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/productForm";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../services/productService";

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    let isActive = true;
    const loadProduct = async () => {
      try {
        const product = await getProduct(id);
        if (isActive) {
          setFormData({
            name: product.name ?? "",
            price: String(product.price ?? ""),
            description: product.description ?? "",
            image: product.image ?? "",
          });
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

    loadProduct();
    return () => {
      isActive = false;
    };
  }, [id]);

  const handleChange = (field) => (value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const product = {
      name: formData.name.trim(),
      price: formData.price,
      description: formData.description.trim(),
      image: formData.image.trim(),
    };

    try {
      if (id) {
        await updateProduct(id, product);
      } else {
        await createProduct(product);
      }
      navigate("/products");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link className="link link-primary" to="/products">
          ← กลับไปหน้ารายการสินค้า
        </Link>
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center py-12" role="status">
            <span className="loading loading-spinner loading-lg" />
            <span className="sr-only">กำลังโหลดข้อมูลสินค้า...</span>
          </div>
        ) : id && error ? (
          <Link className="btn btn-primary" to="/products">
            กลับไปหน้ารายการสินค้า
          </Link>
        ) : (
          <ProductForm
            editingId={id}
            {...formData}
            isSubmitting={isSubmitting}
            onNameChange={handleChange("name")}
            onPriceChange={handleChange("price")}
            onDescriptionChange={handleChange("description")}
            onImageChange={handleChange("image")}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/products")}
          />
        )}
      </div>
    </main>
  );
};

export default ProductFormPage;
