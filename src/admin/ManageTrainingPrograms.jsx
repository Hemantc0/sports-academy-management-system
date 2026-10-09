import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManageTrainingPrograms() {
  const { register, handleSubmit, reset } = useForm();
  const [programs, setPrograms] = useState([
    { id: 1, name: "Youth Elite Football Pro", duration: "6 Months", fee: "₹18,000", level: "Intermediate" },
    { id: 2, name: "Grassroot Cricket Foundation", duration: "3 Months", fee: "₹12,000", level: "Beginner" },
    { id: 3, name: "Fast Track Badminton Masters", duration: "1 Year", fee: "₹30,000", level: "Advanced" }
  ]);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const collectFormData = (formData) => {
    if (editId) {
      setPrograms(programs.map((p) => (p.id === editId ? { ...p, ...formData } : p)));
      toast.success("Training Program updated");
    } else {
      setPrograms([...programs, { id: programs.length ? Math.max(...programs.map((x) => x.id)) + 1 : 1, ...formData }]);
      toast.success("Training Program created");
    }
    reset();
    setEditId(null);
    setShowAddForm(false);
  };

  const handleEdit = (prog) => {
    setEditId(prog.id);
    setShowAddForm(true);
    reset({ name: prog.name, duration: prog.duration, fee: prog.fee, level: prog.level });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      setPrograms(programs.filter((p) => p.id !== id));
      toast.success("Program removed");
    }
  };

  const filteredPrograms = programs
    .filter((p) => p.name?.toLowerCase().includes(searchText.toLowerCase()))
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
            <h2 className="fw-bold mb-0 text-dark">Training Programs</h2>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-primary px-3 rounded-3" onClick={() => toast.info("Refreshed")}>
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
                {showAddForm ? "Close Form" : "+ Add Program"}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">{editId ? "Update Program" : "Add Training Program"}</h5>
              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Program Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Pro Camp" {...register("name", { required: true })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Duration</label>
                    <input type="text" className="form-control" placeholder="e.g. 6 Months" {...register("duration", { required: true })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Fee</label>
                    <input type="text" className="form-control" placeholder="e.g. ₹15,000" {...register("fee", { required: true })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">Skill Level</label>
                    <select className="form-select" {...register("level")}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">{editId ? "Save Changes" : "Create Program"}</button>
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
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1"><i className="bi bi-search me-1"></i> Search Program</label>
              <input type="text" className="form-control bg-light" placeholder="Search by program name..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1"><i className="bi bi-arrow-down-up me-1"></i> Sort By</label>
              <select className="form-select bg-light" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">ID</option>
                <option value="name">Program Name</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Order</label>
              <select className="form-select bg-light" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">A → Z / Low → High</option>
                <option value="desc">Z → A / High → Low</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">Showing <strong>{filteredPrograms.length}</strong> of <strong>{programs.length}</strong> programs</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
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
                  <th className="py-3 px-3">Program Name</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Skill Level</th>
                  <th className="py-3 px-3">Program Fee</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-semibold text-secondary">{p.id}</td>
                    <td className="fw-bold text-dark">{p.name}</td>
                    <td className="text-muted">{p.duration}</td>
                    <td><span className="badge bg-info-subtle text-info-emphasis">{p.level}</span></td>
                    <td className="fw-bold text-success">{p.fee}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2 px-3 rounded-2" onClick={() => handleEdit(p)}>
                        <i className="bi bi-pencil-square me-1"></i> Update
                      </button>
                      <button className="btn btn-danger btn-sm px-3 rounded-2" onClick={() => handleDelete(p.id)}>
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