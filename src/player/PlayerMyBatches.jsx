import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerNavbar from "./PlayerNavbar";

export default function PlayerBatches() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("batchName");
  const [sortOrder, setSortOrder] = useState("asc");

  const getLoggedInUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  const getAuthToken = () => {
    const user = getLoggedInUser();
    if (!user) return "";
    return user.jwtToken || user.token || "";
  };

  const fetchPlayer = async () => {
    const user = getLoggedInUser();
    const token = getAuthToken();

    if (!user) {
      toast.error("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const playerResponse = await fetch(
        `http://localhost:8080/api/v1/get/player/user/${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const playerData = await playerResponse.json();

      if (!playerResponse.ok) {
        toast.error(playerData.message || "Unable to fetch player");
        setLoading(false);
        return;
      }

      const player = playerData.data;

      if (!player || !player.id) {
        toast.error("Player profile not found");
        setLoading(false);
        return;
      }

      const membershipResponse = await fetch(
        `http://localhost:8080/api/v1/player/${player.id}/memberships`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const membershipData = await membershipResponse.json();

      if (!membershipResponse.ok) {
        toast.error(membershipData.message || "Unable to fetch batches");
        setLoading(false);
        return;
      }

      const list = Array.isArray(membershipData.data)
        ? membershipData.data
        : Array.isArray(membershipData)
        ? membershipData
        : [];

      setMemberships(list);
    } catch (error) {
      console.error("Player batches error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, []);

  const getBatchName = (m) => m?.batch?.name || m?.batch?.batchName || "";
  const getProgramName = (m) =>
    m?.batch?.program?.name ||
    m?.batch?.program?.programName ||
    m?.batch?.trainingProgram?.name ||
    "";
  const getStatus = (m) => m?.status || "";

  const filteredMemberships = memberships
    .filter((m) => {
      const q = searchText.toLowerCase().trim();
      const bName = getBatchName(m).toLowerCase();
      const pName = getProgramName(m).toLowerCase();
      const matchSearch = !q || bName.includes(q) || pName.includes(q);
      const matchStatus = statusFilter === "ALL" || getStatus(m) === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortBy === "batchName") {
        valA = getBatchName(a).toLowerCase();
        valB = getBatchName(b).toLowerCase();
      } else if (sortBy === "program") {
        valA = getProgramName(a).toLowerCase();
        valB = getProgramName(b).toLowerCase();
      } else if (sortBy === "startDate") {
        valA = a.start_date || "";
        valB = b.start_date || "";
      } else if (sortBy === "status") {
        valA = getStatus(a).toLowerCase();
        valB = getStatus(b).toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleResetFilters = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setSortBy("batchName");
    setSortOrder("asc");
  };

  return (
    <>
      <PlayerNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          
          {/* Top Header Row with Refresh */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">My Batches</h2>
            <button
              type="button"
              className="btn btn-outline-primary px-3 rounded-3"
              onClick={fetchPlayer}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          <div className="row g-3 align-items-center mb-3">
            {/* Search Box */}
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Batch
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Batch or training program..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-funnel me-1"></i> Status
              </label>
              <select
                className="form-select bg-light"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-arrow-down-up me-1"></i> Sort By
              </label>
              <select
                className="form-select bg-light"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="batchName">Batch Name</option>
                <option value="program">Program</option>
                <option value="startDate">Start Date</option>
                <option value="status">Status</option>
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
              Showing <strong>{filteredMemberships.length}</strong> of{" "}
              <strong>{memberships.length}</strong> batches
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
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Batch Name</th>
                  <th className="py-3 px-3">Training Program</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">End Date</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Loading Batches...
                    </td>
                  </tr>
                ) : filteredMemberships.length > 0 ? (
                  filteredMemberships.map((membership, index) => (
                    <tr key={membership.id || index}>
                      <td className="fw-semibold text-secondary">{index + 1}</td>
                      <td className="fw-bold text-dark">{getBatchName(membership) || "-"}</td>
                      <td className="text-muted">{getProgramName(membership) || "-"}</td>
                      <td className="text-muted">{membership.start_date || "-"}</td>
                      <td className="text-muted">{membership.end_date || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            membership.status === "ACTIVE"
                              ? "bg-success"
                              : membership.status === "EXPIRED"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {membership.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-4 text-muted">
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