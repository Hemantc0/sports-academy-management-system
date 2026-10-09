import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar"; // Imported Admin Navbar

export default function ManageBatches() {
  const { register, handleSubmit, formState, reset } = useForm();

  const [batches, setBatches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // SEARCH / FILTER / SORT
  const [searchText, setSearchText] = useState("");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [coachFilter, setCoachFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // SAFE TOKEN EXTRACTION
  const getAuthToken = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return "";
      const userObj = JSON.parse(userStr);
      return userObj.jwtToken || userObj.token || "";
    } catch {
      return "";
    }
  };

  const parseResponseBody = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { raw: text };
    }
  };

  // FETCH APIS
  async function fetchPrograms() {
    const token = getAuthToken();
    try {
      const response = await fetch("http://localhost:8080/api/v1/get/training-programs", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const res = await parseResponseBody(response);
      if (response.ok) {
        setPrograms(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("fetchPrograms error:", error);
    }
  }

  async function fetchCoaches() {
    const token = getAuthToken();
    try {
      const response = await fetch("http://localhost:8080/api/v1/get/coaches", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const res = await parseResponseBody(response);
      if (response.ok) {
        setCoaches(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error("fetchCoaches error:", error);
    }
  }

  async function fetchBatches() {
    const token = getAuthToken();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/v1/get/batches", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const res = await parseResponseBody(response);
      if (response.ok) {
        setBatches(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []);
      } else {
        toast.error(res.message || `Unable to fetch batches (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error("fetchBatches error:", error);
      toast.error("Unable to fetch batches");
    } finally {
      setLoading(false);
    }
  }

  // SAVE / UPDATE
  async function collectFormData(formData) {
    const token = getAuthToken();
    if (!formData.programId || !formData.coachId) {
      toast.error("Please select both a program and a coach");
      return;
    }

    try {
      const url = editId
        ? `http://localhost:8080/api/v1/admin/batch/${editId}`
        : "http://localhost:8080/api/v1/admin/batch";

      const method = editId ? "PUT" : "POST";
      const payload = {
        name: formData.name,
        programId: Number(formData.programId),
        coachId: Number(formData.coachId)
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const res = await parseResponseBody(response);
      if (response.ok) {
        toast.success(res.message || (editId ? "Batch Updated Successfully" : "Batch Added Successfully"));
        reset();
        setEditId(null);
        setShowAddForm(false);
        fetchBatches();
      } else {
        toast.error(res.message || `Failed to save batch (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to server");
    }
  }

  function editBatch(batch) {
    setEditId(batch.id);
    setShowAddForm(true);
    reset({
      name: batch.name || batch.batchName || "",
      programId: batch.program?.id || batch.trainingProgram?.id || "",
      coachId: batch.coach?.id || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditId(null);
    setShowAddForm(false);
    reset();
  }

  async function deleteBatch(id) {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    const token = getAuthToken();
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/batch/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const res = await parseResponseBody(response);
      if (response.ok) {
        toast.success(res.message || "Batch Deleted Successfully");
        fetchBatches();
      } else {
        toast.error(res.message || `Unable to delete batch (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to server");
    }
  }

  useEffect(() => {
    fetchPrograms();
    fetchCoaches();
    fetchBatches();
  }, []);

  const getBatchName = (batch) => batch.name || batch.batchName || "";
  const getProgramName = (batch) =>
    batch.program?.name ||
    batch.program?.programName ||
    batch.trainingProgram?.name ||
    batch.trainingProgram?.programName ||
    "";
  const getCoachName = (batch) => batch.coach?.name || batch.coach?.user?.username || "";

  // FILTER & SORT LOGIC
  const filteredAndSortedBatches = [...batches]
    .filter((batch) => {
      const search = searchText.toLowerCase().trim();
      if (!search) return true;
      return (
        getBatchName(batch).toLowerCase().includes(search) ||
        getProgramName(batch).toLowerCase().includes(search) ||
        getCoachName(batch).toLowerCase().includes(search)
      );
    })
    .filter((batch) => {
      if (programFilter === "ALL") return true;
      const pId = batch.program?.id || batch.trainingProgram?.id;
      return String(pId) === String(programFilter);
    })
    .filter((batch) => {
      if (coachFilter === "ALL") return true;
      return String(batch.coach?.id || "") === String(coachFilter);
    })
    .sort((a, b) => {
      let valA =
        sortBy === "id"
          ? Number(a.id || 0)
          : sortBy === "batchName"
          ? getBatchName(a).toLowerCase()
          : sortBy === "program"
          ? getProgramName(a).toLowerCase()
          : getCoachName(a).toLowerCase();
      let valB =
        sortBy === "id"
          ? Number(b.id || 0)
          : sortBy === "batchName"
          ? getBatchName(b).toLowerCase()
          : sortBy === "program"
          ? getProgramName(b).toLowerCase()
          : getCoachName(b).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleResetFilters = () => {
    setSearchText("");
    setProgramFilter("ALL");
    setCoachFilter("ALL");
    setSortBy("id");
    setSortOrder("asc");
  };

  return (
    <>
      {/* Admin Navbar at the top */}
      <AdminNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">Manage Batches</h2>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-3 rounded-3"
                onClick={() => {
                  fetchPrograms();
                  fetchCoaches();
                  fetchBatches();
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
              <button
                type="button"
                className={`btn ${showAddForm ? "btn-secondary" : "btn-primary"} px-3 rounded-3`}
                onClick={() => {
                  if (showAddForm) cancelEdit();
                  else setShowAddForm(true);
                }}
              >
                {showAddForm ? "Close Form" : "+ Add Batch"}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">{editId ? "Update Batch" : "Create New Batch"}</h5>
              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Batch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Morning Elite Batch"
                      {...register("name", { required: "Batch name is required" })}
                    />
                    {formState.errors?.name && (
                      <small className="text-danger">{formState.errors.name.message}</small>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Training Program</label>
                    <select
                      className="form-select"
                      {...register("programId", { required: "Please select program" })}
                    >
                      <option value="">Select Program</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name || p.programName || `Program #${p.id}`}
                        </option>
                      ))}
                    </select>
                    {formState.errors?.programId && (
                      <small className="text-danger">{formState.errors.programId.message}</small>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">Assigned Coach</label>
                    <select
                      className="form-select"
                      {...register("coachId", { required: "Please select coach" })}
                    >
                      <option value="">Select Coach</option>
                      {coaches.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name || c.user?.username || `Coach #${c.id}`}
                        </option>
                      ))}
                    </select>
                    {formState.errors?.coachId && (
                      <small className="text-danger">{formState.errors.coachId.message}</small>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    {editId ? "Save Changes" : "Create Batch"}
                  </button>
                  <button type="button" className="btn btn-secondary px-3" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Batch
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Batch, program or coach..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-funnel me-1"></i> Program
              </label>
              <select
                className="form-select bg-light"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="ALL">All Programs</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || p.programName || `Program #${p.id}`}
                  </option>
                ))}
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
                <option value="id">Batch ID</option>
                <option value="batchName">Batch Name</option>
                <option value="program">Program</option>
                <option value="coach">Coach</option>
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
              Showing <strong>{filteredAndSortedBatches.length}</strong> of <strong>{batches.length}</strong> batches
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-2"
              onClick={handleResetFilters}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>

          <div className="table-responsive rounded-3 overflow-hidden border">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead style={{ backgroundColor: "#1e293b", color: "#ffffff" }}>
                <tr>
                  <th className="py-3 px-3">Id</th>
                  <th className="py-3 px-3">Batch Name</th>
                  <th className="py-3 px-3">Training Program</th>
                  <th className="py-3 px-3">Coach</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-muted">
                      Loading Batches...
                    </td>
                  </tr>
                ) : filteredAndSortedBatches.length > 0 ? (
                  filteredAndSortedBatches.map((batch) => (
                    <tr key={batch.id}>
                      <td className="fw-semibold text-secondary">{batch.id}</td>
                      <td className="fw-bold text-dark">{getBatchName(batch) || "-"}</td>
                      <td className="text-muted">{getProgramName(batch) || "-"}</td>
                      <td className="text-muted">{getCoachName(batch) || "-"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2 px-3 rounded-2"
                          onClick={() => editBatch(batch)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm px-3 rounded-2"
                          onClick={() => deleteBatch(batch.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-muted">
                      No Batches Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}