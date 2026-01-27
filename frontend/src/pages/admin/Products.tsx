// frontend\src\pages\admin\Products.tsx
// Admin Products page: full CRUD UI using the reusable products slice + DataTable.
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createProductThunk,
  deleteProductThunk,
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsPagination,
  setProductFilters,
  setSelectedProduct,
  toggleProductStatusThunk,
  updateProductThunk,
  selectSelectedProduct,
} from "../../features/products/productSlice";
import type { ProductForm, Product } from "../../types/product";
import DataTable from "../../components/common/DataTable";
import type { Column } from "../../components/common/DataTable";
const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  is_active: true,
};

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();

  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const pagination = useAppSelector(selectProductsPagination);
  const selected = useAppSelector(selectSelectedProduct);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load products on first render.
  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  const openCreateModal = () => {
    setIsEditing(false);
    setForm(emptyForm);
    dispatch(setSelectedProduct(null));
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEditing(true);
    dispatch(setSelectedProduct(product));
    setForm({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      is_active: product.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selected) {
      dispatch(updateProductThunk({ id: selected.id, data: form }));
    } else {
      dispatch(createProductThunk(form));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Delete product "${product.name}"?`)) {
      dispatch(deleteProductThunk(product.id));
    }
  };

  const handleToggleStatus = (product: Product) => {
    dispatch(toggleProductStatusThunk(product.id));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setProductFilters({ search, page: 1 }));
    dispatch(fetchProducts({ search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setProductFilters({ page }));
    dispatch(fetchProducts({ search, page }));
  };

  const columns: Column<Product>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "price",
      header: "Price",
      render: (row) => <span>${Number(row.price).toFixed(2)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={
            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full " +
            (row.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800")
          }
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-xs px-2 py-1 rounded bg-indigo-600 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="text-xs px-2 py-1 rounded bg-yellow-500 text-white"
          >
            {row.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-xs px-2 py-1 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products (Admin)</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-semibold"
        >
          + New Product
        </button>
      </div>

      {/* Search + filters */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-gray-800 text-white text-sm"
        >
          Search
        </button>
      </form>

      {/* Products table */}
      <DataTable<Product>
        data={products}
        columns={columns}
        loading={loading}
        emptyMessage="No products found."
      />

      {/* Simple pagination controls */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Page {pagination.currentPage} of {pagination.lastPage} • Total{" "}
          {pagination.total}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pagination.currentPage <= 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for create/edit product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Product" : "New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="mt-1 w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    required
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.is_active ?? true}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-semibold"
                >
                  {isEditing ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}