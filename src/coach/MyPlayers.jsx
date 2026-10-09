import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CoachNavbar from "./CoachNavbar";

export default function MyPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPlayers = async () => {
    try {
      setLoading(true);

      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!loggedInUser || !loggedInUser.id) {
        toast.error("Coach information not found");
        setPlayers([]);
        return;
      }

      console.log("Logged In User:", loggedInUser);

      const coachResponse = await fetch(
        `http://localhost:8080/api/v1/get/coach/user/${loggedInUser.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loggedInUser.jwtToken || loggedInUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Coach API Status:", coachResponse.status);

      if (!coachResponse.ok) {
        throw new Error(
          `Failed to fetch coach. Status: ${coachResponse.status}`
        );
      }

      const coachResult = await coachResponse.json();
      console.log("Coach Response:", coachResult);

      const coachId = coachResult.data?.id;

      if (!coachId) {
        toast.error("Coach ID not found");
        setPlayers([]);
        return;
      }

      console.log("Coach ID:", coachId);

      const response = await fetch(
        `http://localhost:8080/api/v1/coach/${coachId}/players`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loggedInUser.jwtToken || loggedInUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("My Players Status:", response.status);

      const responseText = await response.text();
      console.log("My Players Raw Response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch players. Status: ${response.status}`
        );
      }

      const result = JSON.parse(responseText);
      console.log("My Players Response:", result);

      const playerList = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      setPlayers(playerList);
    } catch (error) {
      console.error("My Players Error:", error);
      toast.error("Unable to load players");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlayers();
  }, []);

  return (
    <>
      <CoachNavbar />

      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white">My Players</h2>
            <p className="text-white mb-0">
              Players enrolled in your batches
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchMyPlayers}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Loading...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div
              className="spinner-border text-primary"
              role="status"
            ></div>
            <p className="mt-3 text-white">Loading players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No players found in your batches.
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Player Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Batch</th>
                      <th>Program</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr
                        key={
                          player.membershipId ||
                          player.playerId ||
                          index
                        }
                      >
                        <td>{index + 1}</td>
                        <td>
                          <strong>
                            {player.playerName ||
                              player.username ||
                              "-"}
                          </strong>
                        </td>
                        <td>{player.email || "-"}</td>
                        <td>{player.gender || "-"}</td>
                        <td>{player.phone || "-"}</td>
                        <td>{player.batchName || "-"}</td>
                        <td>{player.programName || "-"}</td>
                        <td>{player.startDate || "-"}</td>
                        <td>{player.endDate || "-"}</td>
                        <td>
                          <span
                            className={
                              player.status === "ACTIVE"
                                ? "badge bg-success"
                                : "badge bg-secondary"
                            }
                          >
                            {player.status || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}