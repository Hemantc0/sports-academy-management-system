import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerNavbar from "./PlayerNavbar";

export default function PlayerProfile() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const fetchPlayerProfile = async () => {
    try {
      setLoading(true);

      if (!loggedInUser || !loggedInUser.id) {
        toast.error("Player information not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/get/player/user/${loggedInUser.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loggedInUser.jwtToken || loggedInUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Response:", errorText);
        throw new Error(
          `Failed to fetch player profile (${response.status})`
        );
      }

      const result = await response.json();
      setPlayer(result.data);
    } catch (error) {
      console.error("Player Profile Error:", error);
      toast.error("Unable to load player profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerProfile();
  }, []);

  return (
    <>
      <PlayerNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">My Profile</h2>
            <button
              type="button"
              className="btn btn-outline-primary px-3 rounded-3"
              onClick={fetchPlayerProfile}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">
              <div
                className="spinner-border text-primary me-2"
                role="status"
              ></div>
              Loading profile...
            </div>
          ) : player ? (
            <div className="p-2">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-person me-1"></i> Username
                  </label>
                  <div className="form-control bg-light py-2 fw-semibold text-dark">
                    {loggedInUser?.username || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-shield-check me-1"></i> Role
                  </label>
                  <div className="form-control bg-light py-2 fw-semibold text-dark">
                    <span className="badge bg-primary me-1">
                      {loggedInUser?.role || "PLAYER"}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-envelope me-1"></i> Email Address
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    {player.email || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-telephone me-1"></i> Phone Number
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    {player.phone || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-calendar-event me-1"></i> Date of Birth
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    {player.dob || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-gender-ambiguous me-1"></i> Gender
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    {player.gender || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-card-heading me-1"></i> Player ID
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    #{player.id || "-"}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted mb-1">
                    <i className="bi bi-geo-alt me-1"></i> Branch
                  </label>
                  <div className="form-control bg-light py-2 text-dark">
                    {player.branch?.name || "-"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info text-center my-4">
              Player profile not found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}