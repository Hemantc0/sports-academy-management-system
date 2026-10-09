import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CoachNavbar from "./CoachNavbar";

export default function MyBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchMyBatches = async () => {
    setLoading(true);
    try {
      const loggedInUser = getLoggedInUser();
      const token = getAuthToken();

      if (!loggedInUser || !loggedInUser.id) {
        toast.error("Coach information not found");
        setLoading(false);
        return;
      }

      const coachResponse = await fetch(
        `http://localhost:8080/api/v1/get/coach/user/${loggedInUser.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const coachResult = await coachResponse.json();

      console.log("Coach Response:", coachResult);

      if (!coachResponse.ok) {
        toast.error(
          coachResult.message || "Coach profile not found"
        );
        setLoading(false);
        return;
      }

      const coach = coachResult.data;

      if (!coach || !coach.id) {
        toast.error("Coach profile not found");
        setLoading(false);
        return;
      }

      console.log("Coach ID:", coach.id);

      const batchResponse = await fetch(
        `http://localhost:8080/api/v1/coach/batches/${coach.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const batchResult = await batchResponse.json();

      console.log("My Batches Response:", batchResult);

      if (!batchResponse.ok) {
        toast.error(
          batchResult.message || "Unable to fetch batches"
        );
        setBatches([]);
        setLoading(false);
        return;
      }

      const batchList = Array.isArray(batchResult.data)
        ? batchResult.data
        : Array.isArray(batchResult)
        ? batchResult
        : [];

      setBatches(batchList);
    } catch (error) {
      console.error("My Batches Error:", error);
      toast.error("Unable to load batches");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBatches();
  }, []);

  return (
    <>
      <CoachNavbar />

      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white">My Batches</h2>

          <button
            className="btn btn-primary"
            onClick={fetchMyBatches}
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
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            ></div>
            <p className="mt-2 text-white">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No batches assigned to you.
          </div>
        ) : (
          <div className="row">
            {batches.map((batch) => (
              <div
                className="col-md-6 col-lg-4 mb-4"
                key={batch.id}
              >
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      <i className="bi bi-people-fill me-2"></i>
                      {batch.name || "-"}
                    </h5>

                    <hr />

                    <p className="mb-2">
                      <strong>Batch ID:</strong> {batch.id}
                    </p>

                    <p className="mb-2">
                      <strong>Program:</strong>{" "}
                      {batch.program?.name || "-"}
                    </p>

                    <p className="mb-2">
                      <strong>Duration:</strong>{" "}
                      {batch.program?.duration || "-"}
                    </p>

                    <p className="mb-2">
                      <strong>Fees:</strong>{" "}
                      {batch.program?.fees !== undefined
                        ? `₹${batch.program.fees}`
                        : "-"}
                    </p>

                    <p className="mb-0">
                      <strong>Coach:</strong>{" "}
                      {batch.coach?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}