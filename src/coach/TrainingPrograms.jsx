import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CoachNavbar from "./CoachNavbar";

export default function TrainingPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainingPrograms = async () => {
    try {
      setLoading(true);

      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (!loggedInUser || !loggedInUser.id) {
        toast.error("Coach information not found");
        setPrograms([]);
        return;
      }

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

      if (!coachResponse.ok) {
        throw new Error("Failed to fetch coach details");
      }

      const coachResult = await coachResponse.json();
      const coachId = coachResult.data?.id;

      if (!coachId) {
        toast.error("Coach ID not found");
        setPrograms([]);
        return;
      }

      const batchResponse = await fetch(
        `http://localhost:8080/api/v1/coach/batches/${coachId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loggedInUser.jwtToken || loggedInUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!batchResponse.ok) {
        throw new Error("Failed to fetch coach batches");
      }

      const batchResult = await batchResponse.json();
      const batches = batchResult.data || [];

      const coachPrograms = batches
        .map((batch) => batch.program)
        .filter((program) => program != null);

      const uniquePrograms = Array.from(
        new Map(
          coachPrograms.map((program) => [
            program.id,
            program
          ])
        ).values()
      );

      setPrograms(uniquePrograms);
    } catch (error) {
      console.error(
        "Training Programs Error:",
        error
      );
      toast.error(
        "Unable to load training programs"
      );
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  return (
    <>
      <CoachNavbar />

      <div className="container mt-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-white">Training programs</h2>
            <p className="text-white mb-0">
              Training programs assigned to your batches
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchTrainingPrograms}
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
            <p className="mt-3 text-white">
              Loading your training programs...
            </p>
          </div>
        ) : programs.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No training programs are assigned to your batches.
          </div>
        ) : (
          <div className="row">
            {programs.map((program) => (
              <div
                className="col-md-6 col-lg-4 mb-4"
                key={program.id}
              >
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      {program.name}
                    </h5>

                    <p className="card-text text-muted">
                      {program.description ||
                        "No description available."}
                    </p>

                    <hr />

                    <p className="mb-2">
                      <strong>Duration:</strong>{" "}
                      {program.duration || "-"}
                    </p>

                    <p className="mb-2">
                      <strong>Fees:</strong>{" "}
                      ₹{program.fees || 0}
                    </p>

                    <p className="mb-0">
                      <strong>Sport:</strong>{" "}
                      {program.sport?.name || "-"}
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