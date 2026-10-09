import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerNavbar from "./PlayerNavbar";

export default function PlayerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("paymentId");
  const [sortOrder, setSortOrder] = useState("asc");

  const getLoggedInUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  const getAuthToken = () => {
    const user = getLoggedInUser();
    return user ? user.jwtToken || user.token || "" : "";
  };

  const parseResponseBody = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { raw: text };
    }
  };

  const getBatchName = (payment) => {
    return (
      payment?.membership?.batch?.name ||
      payment?.membership?.batch?.batchName ||
      "-"
    );
  };

  const getStatus = (payment) => payment?.status || "";

  async function fetchPlayerAndPayments() {
    const loggedInUser = getLoggedInUser();
    const token = getAuthToken();

    if (!loggedInUser) {
      toast.error("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const playerResponse = await fetch(
        `http://localhost:8080/api/v1/get/player/user/${loggedInUser.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const playerData = await parseResponseBody(playerResponse);

      if (!playerResponse.ok) {
        toast.error(
          playerData.message || "Unable to fetch player profile"
        );
        setLoading(false);
        return;
      }

      const player = playerData.data;

      if (!player || !player.id) {
        toast.error("Player profile not found");
        setLoading(false);
        return;
      }

      const paymentResponse = await fetch(
        `http://localhost:8080/api/v1/player/${player.id}/payments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const paymentData = await parseResponseBody(paymentResponse);

      if (paymentResponse.ok) {
        const paymentList = Array.isArray(paymentData.data)
          ? paymentData.data
          : Array.isArray(paymentData)
          ? paymentData
          : [];

        setPayments(paymentList);
      } else {
        toast.error(
          paymentData.message || "Unable to fetch payments"
        );
      }
    } catch (error) {
      console.error("Payment fetch error:", error);
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayerAndPayments();
  }, []);

  // Filter & Sort Logic
  const filteredPayments = payments
    .filter((p) => {
      const q = searchText.toLowerCase().trim();
      const bName = getBatchName(p).toLowerCase();
      const txnId = (p.transaction_Id || p.transaction_id || "").toLowerCase();
      const pId = String(p.id || "");

      const matchSearch =
        !q || bName.includes(q) || txnId.includes(q) || pId.includes(q);

      const matchStatus =
        statusFilter === "ALL" || getStatus(p) === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortBy === "paymentId") {
        valA = a.id || 0;
        valB = b.id || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else if (sortBy === "batchName") {
        valA = getBatchName(a).toLowerCase();
        valB = getBatchName(b).toLowerCase();
      } else if (sortBy === "amount") {
        valA = Number(a.amount) || 0;
        valB = Number(b.amount) || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
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
    setSortBy("paymentId");
    setSortOrder("asc");
  };

  return (
    <>
      <PlayerNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">My Payments</h2>
            <button
              type="button"
              className="btn btn-outline-primary px-3 rounded-3"
              onClick={fetchPlayerAndPayments}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {/* Search, Filter, Sort Row */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Payment
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Batch name, Txn ID, or Payment ID..."
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
                <option value="SUCCESS">SUCCESS</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
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
                <option value="paymentId">Payment ID</option>
                <option value="batchName">Batch Name</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
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

          {/* Counts & Reset Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredPayments.length}</strong> of{" "}
              <strong>{payments.length}</strong> payments
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-2"
              onClick={handleResetFilters}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive rounded-3 overflow-hidden border">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead
                style={{
                  backgroundColor: "#1e293b",
                  color: "#ffffff"
                }}
              >
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Payment ID</th>
                  <th className="py-3 px-3">Membership</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-muted">
                      <div
                        className="spinner-border spinner-border-sm text-primary me-2"
                        role="status"
                      ></div>
                      Loading Payments...
                    </td>
                  </tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.id || index}>
                      <td className="fw-semibold text-secondary">
                        {index + 1}
                      </td>
                      <td className="text-dark fw-semibold">{payment.id}</td>
                      <td className="text-muted">
                        {payment?.membership?.id
                          ? `Membership #${payment.membership.id}`
                          : "-"}
                      </td>
                      <td className="fw-bold text-dark">
                        {getBatchName(payment)}
                      </td>
                      <td className="fw-semibold text-dark">
                        ₹{payment.amount}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            payment.status === "SUCCESS" ||
                            payment.status === "PAID"
                              ? "bg-success"
                              : payment.status === "PENDING"
                              ? "bg-warning text-dark"
                              : payment.status === "FAILED"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {payment.status || "-"}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {payment.transaction_Id ||
                          payment.transaction_id ||
                          "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-muted">
                      No Payments Found
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