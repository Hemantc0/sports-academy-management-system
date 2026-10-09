import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "./AdminNavbar";

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // ================= GET LOGGED IN USER =================
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

  // ================= GET JWT TOKEN =================
  const getAuthToken = () => {
    const user = getLoggedInUser();
    if (!user) return "";
    return user.jwtToken || user.token || "";
  };

  // ================= FETCH PAYMENTS =================
  const fetchPayments = async () => {
    const token = getAuthToken();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/v1/get/payments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "Unable to fetch payments");
        setPayments([]);
        return;
      }

      const paymentList = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      setPayments(paymentList);
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("Unable to connect to server");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ================= HELPER GETTERS =================
  const getPlayerName = (payment) => {
    return (
      payment?.player?.name ||
      payment?.player?.user?.username ||
      payment?.player?.username ||
      "-"
    );
  };

  const getBatchName = (payment) => {
    return (
      payment?.membership?.batch?.name ||
      payment?.membership?.batch?.batchName ||
      "-"
    );
  };

  const getProgramName = (payment) => {
    return (
      payment?.membership?.batch?.program?.name ||
      payment?.membership?.batch?.trainingProgram?.name ||
      "-"
    );
  };

  const getTransactionId = (payment) => {
    return (
      payment?.transaction_Id ||
      payment?.transaction_id ||
      "-"
    );
  };

  // ================= FILTER + SORT =================
  const filteredPayments = [...payments]
    .filter((payment) => {
      const q = searchText.toLowerCase().trim();
      const playerName = getPlayerName(payment).toLowerCase();
      const transactionId = getTransactionId(payment).toLowerCase();
      const batchName = getBatchName(payment).toLowerCase();

      const matchSearch =
        playerName.includes(q) ||
        transactionId.includes(q) ||
        batchName.includes(q);

      const status = payment?.status || "";
      const matchStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "id") {
        valueA = Number(a?.id || 0);
        valueB = Number(b?.id || 0);
      } else if (sortBy === "amount") {
        valueA = Number(a?.amount || 0);
        valueB = Number(b?.amount || 0);
      } else if (sortBy === "player") {
        valueA = getPlayerName(a).toLowerCase();
        valueB = getPlayerName(b).toLowerCase();
      } else if (sortBy === "status") {
        valueA = (a?.status || "").toLowerCase();
        valueB = (b?.status || "").toLowerCase();
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  // ================= STATUS BADGE =================
  const getStatusBadge = (status) => {
    if (status === "PAID" || status === "SUCCESS") {
      return "badge bg-success";
    }
    if (status === "PENDING") {
      return "badge bg-warning text-dark";
    }
    if (status === "FAILED") {
      return "badge bg-danger";
    }
    return "badge bg-secondary";
  };

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">Payment Records</h2>

            <button
              type="button"
              className="btn btn-outline-primary px-3 rounded-3"
              onClick={fetchPayments}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              {loading ? "Loading..." : "Refresh"}
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
                placeholder="Player, Transaction ID or Batch..."
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
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
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
                <option value="id">Payment ID</option>
                <option value="player">Player</option>
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

          {/* Counts & Reset */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              Showing <strong>{filteredPayments.length}</strong> of{" "}
              <strong>{payments.length}</strong> payments
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSearchText("");
                setStatusFilter("ALL");
                setSortBy("id");
                setSortOrder("asc");
              }}
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
                  <th className="py-3 px-3">Payment ID</th>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Player</th>
                  <th className="py-3 px-3">Program</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-5 text-muted">
                      <div className="spinner-border text-primary mb-2"></div>
                      <div>Loading Payments...</div>
                    </td>
                  </tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.id || index}>
                      <td className="fw-semibold text-secondary">
                        {payment.id}
                      </td>

                      <td className="font-monospace fw-semibold">
                        {getTransactionId(payment)}
                      </td>

                      <td className="fw-bold text-dark">
                        {getPlayerName(payment)}
                      </td>

                      <td className="text-muted">
                        {getProgramName(payment)}
                      </td>

                      <td className="text-muted">
                        {getBatchName(payment)}
                      </td>

                      <td className="fw-bold text-success">
                        ₹{payment.amount ?? 0}
                      </td>

                      <td>
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-5 text-muted">
                      <i className="bi bi-credit-card fs-2 d-block mb-2"></i>
                      No payment records found.
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