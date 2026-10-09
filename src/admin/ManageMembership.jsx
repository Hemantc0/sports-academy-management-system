import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManageMembership() {
  const { register, handleSubmit, formState, reset } = useForm();

  const [memberships, setMemberships] = useState([
    { id: 1, type: "Gold Annual", fee: "₹24,000", duration: "12 Months", access: "All Sports + Gym", status: "Active" },
    { id: 2, type: "Silver Quarterly", fee: "₹7,500", duration: "3 Months", access: "Single Sport (Turf)", status: "Active" },
    { id: 3, type: "Bronze Monthly", fee: "₹2,800", duration: "1 Month", access: "Weekend Batches", status: "Active" },
    { id: 4, type: "Junior Pro Plan", fee: "₹15,000", duration: "6 Months", access: "Academy Training + Kit", status: "Inactive" }
  ]);

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // SEARCH / FILTER / SORT
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const collectFormData = (formData) => {
    if (editId) {
      setMemberships(memberships.map((m) => (m.id === editId ? { ...m, ...formData } : m)));
      toast.success("Membership plan updated");
    } else {
      const newId = memberships.length ? Math.max(...memberships.map((x) => x.id)) + 1 : 1;
      setMemberships([...memberships, { id: newId, ...formData }]);
      toast.success("Membership plan added");
    }
    reset();
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEdit = (mem) => {
    setEditId(mem.id);
    setShowAddForm(true);
    reset({
      type: mem.type,
      fee: mem.fee,
      duration: mem.duration,
      access: mem.access,
      status: mem.status
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this membership plan?")) {
      setMemberships(memberships.filter((m) => m.id !== id));
      toast.success("Plan deleted");
    }
  };

  const filteredMemberships = memberships
    .filter((m) => {
      const q = searchText.toLowerCase().trim();
      const matchSearch =
        m.type?.toLowerCase().includes(q) ||
        m.access?.toLowerCase().includes(q) ||
        m.duration?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "ALL" || m.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = sortBy === "id" ? Number(a.id) : (a[sortBy] || "").toLowerCase();
      let valB = sortBy === "id" ? Number(b.id) : (b[sortBy] || "").toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">Manage Memberships</h2>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-3 rounded-3"
                onClick={() => toast.info("Plans refreshed")}
              >
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
                {showAddForm ? "Close Form" : "+ Add Plan"}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">{editId ? "Update Membership Plan" : "Create New Plan"}</h5>
              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Plan Type / Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Gold Annual"
                      {...register("type", { required: "Plan name required" })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold text-secondary">Fee (Amount)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ₹24,000"
                      {...register("fee", { required: "Fee required" })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold text-secondary">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 12 Months"
                      {...register("duration", { required: "Duration required" })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Access / Perks</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. All Sports + Gym"
                      {...register("access", { required: true })}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold text-secondary">Status</label>
                    <select className="form-select" {...register("status")}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    {editId ? "Save Changes" : "Create Plan"}
                  </button>
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
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Plan
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Search plan or access..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-funnel me-1"></i> Plan Status
              </label>
              <select
                className="form-select bg-light"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-arrow-down-up me-1"></i> Sort By
              </label>
              <select
                className="form-select bg-light"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="id">Plan ID</option>
                <option value="type">Plan Name</option>
                <option value="fee">Fee</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Order</label>
              <select
                className="form-select bg-light"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A → Z / Low → High</option>
                <option value="desc">Z → A / High → Low</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredMemberships.length}</strong> of <strong>{memberships.length}</strong> plans
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
                setStatusFilter("ALL");
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
                  <th className="py-3 px-3">Plan Type</th>
                  <th className="py-3 px-3">Membership Fee</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Facility Access</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemberships.map((m) => (
                  <tr key={m.id}>
                    <td className="fw-semibold text-secondary">{m.id}</td>
                    <td className="fw-bold text-dark">{m.type}</td>
                    <td className="fw-bold text-success">{m.fee}</td>
                    <td className="text-muted">{m.duration}</td>
                    <td className="text-muted">{m.access}</td>
                    <td>
                      <span className={`badge ${m.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2 px-3 rounded-2" onClick={() => handleEdit(m)}>
                        <i className="bi bi-pencil-square me-1"></i> Update
                      </button>
                      <button className="btn btn-danger btn-sm px-3 rounded-2" onClick={() => handleDelete(m.id)}>
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}