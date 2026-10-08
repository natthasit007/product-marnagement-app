const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/products`;

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const message =
      typeof body === "string" ? body : body.message || body.error;
    throw new Error(message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const getProducts = () => request(API_URL);

const getProduct = (id) => request(`${API_URL}/${id}`);

const createProduct = (product) =>
  request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

const updateProduct = (id, product) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

const deleteProduct = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
