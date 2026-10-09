import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManageBranches() {
  const { register, handleSubmit, formState, reset } = useForm();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // SEARCH / SORT
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // GET AUTH TOKEN
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

  // PARSE RESPONSE
  const parseResponseBody = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { raw: text };
    }
  };

  // GET ALL BRANCHES
  async function fetchBranches() {
    const token = getAuthToken();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/v1/get/branches",
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const res = await parseResponseBody(response);

      if (!response.ok) {
        toast.error(res.message || "Unable to fetch branches");
        setBranches([]);
        return;
      }

      const fetchedData = Array.isArray(res.data) ? res.data : [];
      setBranches(fetchedData);
    } catch (error) {
      console.error("fetchBranches error:", error);
      toast.error("Unable to load branches");
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  // ADD / UPDATE BRANCH
  async function collectFormData(formData) {
    const token = getAuthToken();

    const branchPayload = {
      name: formData.name,
      location: formData.location
    };

    try {
      if (!editId) {
        const response = await fetch(
          "http://localhost:8080/api/v1/add/branch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(branchPayload)
          }
        );

        const res = await parseResponseBody(response);

        if (!response.ok) {
          toast.error(res.message || "Failed to add branch");
          return;
        }

        toast.success(res.message || "Branch added successfully");
      } else {
        const response = await fetch(
          `http://localhost:8080/api/v1/update-branch/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(branchPayload)
          }
        );

        const res = await parseResponseBody(response);

        if (!response.ok) {
          toast.error(res.message || "Failed to update branch");
          return;
        }

        toast.success(res.message || "Branch updated successfully");
      }

      await fetchBranches();
      reset();
      setEditId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Branch save error:", error);
      toast.error("Unable to save branch. Please check backend.");
    }
  }

  // EDIT BRANCH
  function editBranch(branch) {
    setEditId(branch.id);
    setShowAddForm(true);

    reset({
      name: branch.name || "",
      location: branch.location || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // CANCEL
  function cancelEdit() {
    setEditId(null);
    setShowAddForm(false);
    reset();
  }

  // DELETE BRANCH
  async function deleteBranch(id) {
    if (!window.confirm("Are you sure you want to delete this branch?")) {
      return;
    }

    const token = getAuthToken();

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/delete-branch/${id}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const res = await parseResponseBody(response);

      if (!response.ok) {
        toast.error(res.message || "Failed to delete branch");
        return;
      }

      toast.success(res.message || "Branch deleted successfully");
      await fetchBranches();
    } catch (error) {
      console.error("Delete branch error:", error);
      toast.error("Unable to delete branch. Please check backend.");
    }
  }

  // SEARCH + SORT
  const filteredAndSortedBranches = [...branches]
    .filter((b) => {
      const search = searchText.toLowerCase().trim();
      if (!search) return true;

      const bName = (b.name || "").toLowerCase();
      const bLoc = (b.location || "").toLowerCase();

      return bName.includes(search) || bLoc.includes(search);
    })
    .sort((a, b) => {
      let valA =
        sortBy === "id"
          ? Number(a.id || 0)
          : (a.name || "").toLowerCase();

      let valB =
        sortBy === "id"
          ? Number(b.id || 0)
          : (b.name || "").toLowerCase();

      if (valA < valB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  // RESET FILTERS
  const handleResetFilters = () => {
    setSearchText("");
    setSortBy("id");
    setSortOrder("asc");
  };

  return (
    <>
      <AdminNavbar />

      <div
        className="container mt-4 mb-5"
        style={{ maxWidth: "1140px" }}
      >
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">
              Manage Branches
            </h2>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-3 rounded-3"
                onClick={fetchBranches}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>

              <button
                type="button"
                className={`btn ${
                  showAddForm ? "btn-secondary" : "btn-primary"
                } px-3 rounded-3`}
                onClick={() => {
                  if (showAddForm) {
                    cancelEdit();
                  } else {
                    setShowAddForm(true);
                  }
                }}
              >
                {showAddForm ? "Close Form" : "+ Add Branch"}
              </button>
            </div>
          </div>

          {/* ADD / UPDATE FORM */}
          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">
                {editId ? "Update Branch" : "Add New Branch"}
              </h5>

              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  {/* NAME */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Branch Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Pune West Campus"
                      {...register("name", {
                        required: "Branch name is required"
                      })}
                    />

                    {formState.errors?.name && (
                      <small className="text-danger">
                        {formState.errors.name.message}
                      </small>
                    )}
                  </div>

                  {/* LOCATION */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Location / Area
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Kothrud, Pune"
                      {...register("location", {
                        required: "Location is required"
                      })}
                    />

                    {formState.errors?.location && (
                      <small className="text-danger">
                        {formState.errors.location.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                  >
                    {editId ? "Save Changes" : "Create Branch"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary px-3"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SEARCH / SORT */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i>
                Search Branch
              </label>

              <input
                type="text"
                className="form-control bg-light"
                placeholder="Branch name or location..."
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
                <option value="id">Branch ID</option>
                <option value="name">Branch Name</option>
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

          {/* COUNT + RESET */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredAndSortedBranches.length}</strong> of{" "}
              <strong>{branches.length}</strong> branches
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-2"
              onClick={handleResetFilters}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Reset
            </button>
          </div>

          {/* TABLE */}
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
                  <th className="py-3 px-3">Branch Name</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-muted">
                      Loading Branches...
                    </td>
                  </tr>
                ) : filteredAndSortedBranches.length > 0 ? (
                  filteredAndSortedBranches.map((branch) => (
                    <tr key={branch.id}>
                      <td className="fw-semibold text-secondary">
                        {branch.id}
                      </td>

                      <td className="fw-bold text-dark">
                        {branch.name}
                      </td>

                      <td className="text-muted">
                        {branch.location || "-"}
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2 px-3 rounded-2"
                          onClick={() => editBranch(branch)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Update
                        </button>

                        <button
                          className="btn btn-danger btn-sm px-3 rounded-2"
                          onClick={() => deleteBranch(branch.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-muted">
                      No Branches Found
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