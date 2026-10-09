import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManageSports() {
  const { register, handleSubmit, formState, reset } = useForm();
  const [sports, setSports] = useState([
    { id: 1, name: "Football", category: "Outdoor", description: "Turf training & youth league" },
    { id: 2, name: "Basketball", category: "Indoor", description: "Indoor court tactics & agility" },
    { id: 3, name: "Cricket", category: "Outdoor", description: "Turf net practice & bowling machines" },
    { id: 4, name: "Badminton", category: "Indoor", description: "Synthetic court singles & doubles" }
  ]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const getAuthToken = () => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      return userObj.jwtToken || userObj.token || "";
    } catch {
      return "";
    }
  };

  async function fetchSports() {
    const token = getAuthToken();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/get/sports", {
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      if (res.ok && data?.data) setSports(data.data);
    } catch (e) {
      console.warn("fetchSports fallback:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSports();
  }, []);

  const collectFormData = (formData) => {
    if (editId) {
      setSports(sports.map((s) => (s.id === editId ? { ...s, ...formData } : s)));
      toast.success("Sport updated successfully");
    } else {
      setSports([...sports, { id: sports.length ? Math.max(...sports.map((x) => x.id)) + 1 : 1, ...formData }]);
      toast.success("Sport added successfully");
    }
    reset();
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEdit = (sport) => {
    setEditId(sport.id);
    setShowAddForm(true);
    reset({ name: sport.name, category: sport.category, description: sport.description });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sport?")) {
      setSports(sports.filter((s) => s.id !== id));
      toast.success("Sport deleted successfully");
    }
  };

  const filteredSports = sports
    .filter((s) => {
      const q = searchText.toLowerCase();
      return (
        (s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)) &&
        (categoryFilter === "ALL" || s.category === categoryFilter)
      );
    })
    .sort((a, b) => {
      let vA = sortBy === "id" ? Number(a.id) : a[sortBy]?.toLowerCase();
      let vB = sortBy === "id" ? Number(b.id) : b[sortBy]?.toLowerCase();
      if (vA < vB) return sortOrder === "asc" ? -1 : 1;
      if (vA > vB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">Manage Sports</h2>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-primary px-3 rounded-3" onClick={fetchSports}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
              <button
                type="button"
                className={`btn ${showAddForm ? "btn-secondary" : "btn-primary"} px-3 rounded-3`}
                onClick={() => {
                  if (showAddForm) {
                    setEditId(null);
                    reset();
                  }
                  setShowAddForm(!showAddForm);
                }}
              >
                {showAddForm ? "Close Form" : "+ Add Sport"}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">{editId ? "Update Sport" : "Add New Sport"}</h5>
              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Sport Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Football" {...register("name", { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Category</label>
                    <select className="form-select" {...register("category", { required: true })}>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Indoor">Indoor</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Description</label>
                    <input type="text" className="form-control" placeholder="Short description" {...register("description")} />
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">{editId ? "Save Changes" : "Create Sport"}</button>
                  <button
                    type="button"
                    className="btn btn-secondary px-3"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditId(null);
                      reset();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1"><i className="bi bi-search me-1"></i> Search Sport</label>
              <input type="text" className="form-control bg-light" placeholder="Search by name..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1"><i className="bi bi-funnel me-1"></i> Category</label>
              <select className="form-select bg-light" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="ALL">All Categories</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1"><i className="bi bi-arrow-down-up me-1"></i> Sort By</label>
              <select className="form-select bg-light" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">ID</option>
                <option value="name">Sport Name</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Order</label>
              <select className="form-select bg-light" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">A → Z / Low → High</option>
                <option value="desc">Z → A / High → Low</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">Showing <strong>{filteredSports.length}</strong> of <strong>{sports.length}</strong> sports</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
                setCategoryFilter("ALL");
                setSortBy("id");
                setSortOrder("asc");
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>

          <div className="table-responsive rounded-3 overflow-hidden border">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                <tr>
                  <th className="py-3 px-3">Id</th>
                  <th className="py-3 px-3">Sport Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="py-4 text-muted">Loading Sports...</td></tr>
                ) : filteredSports.length > 0 ? (
                  filteredSports.map((sport) => (
                    <tr key={sport.id}>
                      <td className="fw-semibold text-secondary">{sport.id}</td>
                      <td className="fw-bold text-dark">{sport.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            sport.category === "Indoor"
                              ? "bg-info-subtle text-info"
                              : "bg-primary-subtle text-primary"
                          }`}
                        >
                          {sport.category}
                        </span>
                      </td>
                      <td className="text-muted">{sport.description || "-"}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm rounded-2 d-inline-flex align-items-center justify-content-center p-2"
                            title="Update Sport"
                            aria-label="Update Sport"
                            onClick={() => handleEdit(sport)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm rounded-2 d-inline-flex align-items-center justify-content-center p-2"
                            title="Delete Sport"
                            aria-label="Delete Sport"
                            onClick={() => handleDelete(sport.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="py-4 text-muted">No Sports Found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}