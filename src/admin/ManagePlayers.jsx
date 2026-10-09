import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManagePlayers() {
  const { register, handleSubmit, formState, reset } = useForm();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // SEARCH / FILTER / SORT
  const [searchText, setSearchText] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // =========================
  // GET JWT TOKEN
  // =========================
  const getAuthToken = () => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      return userObj.jwtToken || userObj.token || "";
    } catch {
      return "";
    }
  };

  // =========================
  // FETCH ALL PLAYERS
  // =========================
  async function fetchPlayers() {
    const token = getAuthToken();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/v1/get/players", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();
      console.log("Players API Response:", data);

      if (res.ok && data?.data) {
        setPlayers(data.data);
      } else {
        toast.error(data?.message || "Failed to fetch players");
      }
    } catch (error) {
      console.error("fetchPlayers error:", error);
      toast.error("Unable to fetch players");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  // =========================
  // ADD / UPDATE PLAYER
  // =========================
  const collectFormData = async (formData) => {
    const token = getAuthToken();

    try {
      setLoading(true);

      const playerData = {
        user: {
          username: formData.username
        },
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob
      };

      if (editId) {
        const res = await fetch(
          `http://localhost:8080/api/v1/admin/player/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(playerData)
          }
        );

        const data = await res.json();
        console.log("Update Player Response:", data);

        if (!res.ok) {
          toast.error(data?.message || "Failed to update player");
          return;
        }

        toast.success("Player details updated successfully");
        await fetchPlayers();
      } else {
        const res = await fetch("http://localhost:8080/api/v1/admin/player", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(playerData)
        });

        const data = await res.json();
        console.log("Add Player Response:", data);

        if (!res.ok) {
          toast.error(data?.message || "Failed to add player");
          return;
        }

        toast.success("Player added successfully");
        await fetchPlayers();
      }

      reset();
      setEditId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Player save error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT PLAYER
  // =========================
  const handleEdit = (player) => {
    setEditId(player.id);
    setShowAddForm(true);

    reset({
      username: player.user?.username || "",
      email: player.email,
      gender: player.gender,
      dob: player.dob
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DELETE PLAYER
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    const token = getAuthToken();

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/v1/admin/player/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const data = await res.json();
      console.log("Delete Player Response:", data);

      if (!res.ok) {
        toast.error(data?.message || "Failed to delete player");
        return;
      }

      toast.success("Player deleted successfully");
      await fetchPlayers();
    } catch (error) {
      console.error("Delete player error:", error);
      toast.error("Something went wrong while deleting player");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH / FILTER / SORT
  // =========================
  const filteredPlayers = players
    .filter((p) => {
      const q = searchText.toLowerCase().trim();
      const username = p.user?.username?.toLowerCase() || "";
      const matchSearch =
        username.includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.gender?.toLowerCase().includes(q);

      const matchGender =
        genderFilter === "ALL" || p.gender === genderFilter;

      return matchSearch && matchGender;
    })
    .sort((a, b) => {
      let valA =
        sortBy === "id"
          ? Number(a.id)
          : sortBy === "username"
          ? (a.user?.username || "").toLowerCase()
          : (a[sortBy] || "").toLowerCase();

      let valB =
        sortBy === "id"
          ? Number(b.id)
          : sortBy === "username"
          ? (b.user?.username || "").toLowerCase()
          : (b[sortBy] || "").toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* ================= HEADER ================= */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">Manage Players</h2>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary px-3 rounded-3"
                onClick={fetchPlayers}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>

              <button
                type="button"
                className={`btn ${
                  showAddForm ? "btn-secondary" : "btn-primary"
                } px-3 rounded-3`}
                onClick={() => {
                  if (showAddForm) {
                    setEditId(null);
                    reset();
                  }
                  setShowAddForm(!showAddForm);
                }}
              >
                {showAddForm ? "Close Form" : "+ Add Player"}
              </button>
            </div>
          </div>

          {/* ================= ADD / UPDATE FORM ================= */}
          {showAddForm && (
            <div className="bg-light p-4 rounded-3 mb-4 border">
              <h5 className="fw-bold mb-3">
                {editId ? "Update Player" : "Register New Player"}
              </h5>

              <form onSubmit={handleSubmit(collectFormData)}>
                <div className="row g-3">
                  {/* USERNAME */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. rashi"
                      {...register("username", {
                        required: "Username required"
                      })}
                    />
                    {formState.errors?.username && (
                      <small className="text-danger">
                        {formState.errors.username.message}
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
                      placeholder="e.g. player@gmail.com"
                      {...register("email", {
                        required: "Email required"
                      })}
                    />
                    {formState.errors?.email && (
                      <small className="text-danger">
                        {formState.errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* GENDER */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      {...register("gender", { required: true })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("dob", { required: true })}
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editId
                      ? "Save Changes"
                      : "Create Player"}
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

          {/* ================= SEARCH / FILTER / SORT ================= */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Player
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Username, email or gender..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-funnel me-1"></i> Gender
              </label>
              <select
                className="form-select bg-light"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="ALL">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
                <option value="id">Player ID</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="col-md-2">
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

          {/* ================= PLAYER COUNT & RESET ================= */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredPlayers.length}</strong> of{" "}
              <strong>{players.length}</strong> players
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
                setGenderFilter("ALL");
                setSortBy("id");
                setSortOrder("asc");
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>

          {/* ================= PLAYER TABLE ================= */}
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
                  <th className="py-3 px-3">Username</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Gender</th>
                  <th className="py-3 px-3">Date Of Birth</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
                      Loading Players...
                    </td>
                  </tr>
                ) : filteredPlayers.length > 0 ? (
                  filteredPlayers.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold text-secondary">{p.id}</td>
                      <td className="fw-bold text-dark">
                        {p.user?.username || "-"}
                      </td>
                      <td className="text-muted">{p.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.gender === "Female"
                              ? "bg-info-subtle text-info"
                              : "bg-primary-subtle text-primary"
                          }`}
                        >
                          {p.gender}
                        </span>
                      </td>
                      <td className="text-muted">{p.dob || "-"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2 px-3 rounded-2"
                          onClick={() => handleEdit(p)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Update
                        </button>

                        <button
                          className="btn btn-danger btn-sm px-3 rounded-2"
                          onClick={() => handleDelete(p.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
                      No Players Found
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