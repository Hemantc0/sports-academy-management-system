import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManageCoaches() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // =========================
  // GET JWT TOKEN
  // =========================
  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.jwtToken || user?.token || "";
    } catch {
      return "";
    }
  };

  // =========================
  // FETCH ALL COACHES
  // =========================
  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await fetch(
        "http://localhost:8080/api/v1/get/coaches",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const responseObject = await response.json();
      console.log("Coach Response:", responseObject);

      if (!response.ok) {
        toast.error(
          responseObject?.message || "Failed to fetch coaches"
        );
        return;
      }

      setCoaches(responseObject.data || []);
    } catch (error) {
      console.error("Fetch Coaches Error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  // =========================
  // ADD / UPDATE COACH
  // =========================
  const collectFormData = async (formData) => {
    try {
      const token = getToken();
      let url = "http://localhost:8080/api/v1/admin/coach";
      let method = "POST";

      if (editId) {
        url = `http://localhost:8080/api/v1/admin/coach/${editId}`;
        method = "PUT";
      }

      const coachData = {
        name: formData.name,
        specialization: formData.specialization,
        email: formData.email,
        phone: formData.phone
      };

      console.log("Coach Data:", coachData);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(coachData)
      });

      const responseObject = await response.json();
      console.log("Save Coach Response:", responseObject);

      if (!response.ok) {
        toast.error(
          responseObject?.message ||
            `Failed to ${editId ? "update" : "add"} coach`
        );
        return;
      }

      if (editId) {
        toast.success("Coach updated successfully");
      } else {
        toast.success("Coach added successfully");
      }

      reset();
      setEditId(null);
      setShowAddForm(false);
      fetchCoaches();
    } catch (error) {
      console.error("Save Coach Error:", error);
      toast.error("Unable to connect to server");
    }
  };

  // =========================
  // EDIT COACH
  // =========================
  const handleEdit = (coach) => {
    setEditId(coach.id);
    setShowAddForm(true);

    reset({
      name: coach.name || "",
      specialization: coach.specialization || "",
      email: coach.email || "",
      phone: coach.phone || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DELETE COACH
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this coach?")) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/coach/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const responseObject = await response.json();
      console.log("Delete Coach Response:", responseObject);

      if (!response.ok) {
        toast.error(
          responseObject?.message || "Failed to delete coach"
        );
        return;
      }

      toast.success("Coach removed successfully");
      fetchCoaches();
    } catch (error) {
      console.error("Delete Coach Error:", error);
      toast.error("Unable to connect to server");
    }
  };

  // =========================
  // FILTER + SORT
  // =========================
  const filteredCoaches = [...coaches]
    .filter((coach) => {
      const q = searchText.toLowerCase().trim();
      return (
        coach.name?.toLowerCase().includes(q) ||
        coach.specialization?.toLowerCase().includes(q) ||
        coach.email?.toLowerCase().includes(q) ||
        coach.phone?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "id") {
        valueA = Number(a.id);
        valueB = Number(b.id);
      } else {
        valueA = a[sortBy]?.toString().toLowerCase() || "";
        valueB = b[sortBy]?.toString().toLowerCase() || "";
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  // =========================
  // RESET FORM
  // =========================
  const closeForm = () => {
    setShowAddForm(false);
    setEditId(null);
    reset();
  };

  return (
    <>
      <AdminNavbar />

      <div
        className="container mt-4 mb-5"
        style={{ maxWidth: "1140px" }}
      >
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* ================= HEADER ================= */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">
              Manage Coaches
            </h2>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-3 rounded-3"
                onClick={fetchCoaches}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                className={`btn ${
                  showAddForm ? "btn-secondary" : "btn-primary"
                } px-3 rounded-3`}
                onClick={() => {
                  if (showAddForm) {
                    closeForm();
                  } else {
                    setShowAddForm(true);
                  }
                }}
              >
                {showAddForm ? "Close Form" : "+ Add Coach"}
              </button>
            </div>
          </div>

          {/* ================= FORM ================= */}
          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">
                {editId ? "Update Coach Profile" : "Register New Coach"}
              </h5>

              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  {/* NAME */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Patil"
                      {...register("name", {
                        required: "Name is required"
                      })}
                    />
                    {errors.name && (
                      <small className="text-danger">
                        {errors.name.message}
                      </small>
                    )}
                  </div>

                  {/* SPECIALIZATION */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Specialization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Football"
                      {...register("specialization", {
                        required: "Specialization is required"
                      })}
                    />
                    {errors.specialization && (
                      <small className="text-danger">
                        {errors.specialization.message}
                      </small>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. coach@academy.com"
                      {...register("email", {
                        required: "Email is required"
                      })}
                    />
                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* PHONE */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      {...register("phone", {
                        required: "Phone is required"
                      })}
                    />
                    {errors.phone && (
                      <small className="text-danger">
                        {errors.phone.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                  >
                    {editId ? "Save Changes" : "Register Coach"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary px-3"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= SEARCH / SORT ================= */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i>
                Search Coach
              </label>

              <input
                type="text"
                className="form-control bg-light"
                placeholder="Search by name, sport, email or phone..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-arrow-down-up me-1"></i>
                Sort By
              </label>

              <select
                className="form-select bg-light"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="id">Coach ID</option>
                <option value="name">Name</option>
                <option value="specialization">Sport</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                Order
              </label>

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

          {/* ================= COUNT ================= */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredCoaches.length}</strong> of{" "}
              <strong>{coaches.length}</strong> coaches
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
                setSortBy("id");
                setSortOrder("asc");
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Reset
            </button>
          </div>

          {/* ================= TABLE ================= */}
          <div className="table-responsive rounded-3 overflow-hidden border">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead
                style={{
                  backgroundColor: "#1e293b",
                  color: "#ffffff"
                }}
              >
                <tr>
                  <th className="py-3 px-3">Id</th>
                  <th className="py-3 px-3">Coach Name</th>
                  <th className="py-3 px-3">Sport</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
                      Loading coaches...
                    </td>
                  </tr>
                ) : filteredCoaches.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
                      No coaches found
                    </td>
                  </tr>
                ) : (
                  filteredCoaches.map((coach) => (
                    <tr key={coach.id}>
                      <td className="fw-semibold text-secondary">
                        {coach.id}
                      </td>

                      <td className="fw-bold text-dark">
                        {coach.name || "-"}
                      </td>

                      <td>
                        <span className="badge bg-warning-subtle text-warning-emphasis">
                          {coach.specialization || "-"}
                        </span>
                      </td>

                      <td className="text-muted">{coach.email || "-"}</td>

                      <td className="text-muted">{coach.phone || "-"}</td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2 px-3 rounded-2"
                          onClick={() => handleEdit(coach)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Update
                        </button>

                        <button
                          className="btn btn-danger btn-sm px-3 rounded-2"
                          onClick={() => handleDelete(coach.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}