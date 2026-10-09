import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PlayerNavbar from "./PlayerNavbar";

export default function PlayerMembership() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Filters & Sorting state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("planName");
  const [sortOrder, setSortOrder] = useState("asc");

  // =========================
  // GET LOGGED IN USER
  // =========================
  const getLoggedInUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("User parsing error:", error);
      return null;
    }
  };

  // =========================
  // GET JWT TOKEN
  // =========================
  const getAuthToken = () => {
    const user = getLoggedInUser();
    return user ? user.jwtToken || user.token || "" : "";
  };

  // =========================
  // FETCH MEMBERSHIPS
  // =========================
  const fetchMembership = async () => {
    const user = getLoggedInUser();
    const token = getAuthToken();

    if (!user) {
      toast.error("Please login first");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/v1/get/player/user/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      const data = await res.json();

      if (res.ok && data?.data) {
        const list = Array.isArray(data.data.memberships)
          ? data.data.memberships
          : [];
        setMemberships(list);
      } else {
        setMemberships([]);
      }
    } catch (error) {
      console.error("Membership fetch error:", error);
      toast.error("Unable to load membership");
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  // Helper getters
  const getPlanName = (m) =>
    m?.batch?.program?.name ||
    m?.batch?.program?.programName ||
    m?.batch?.trainingProgram?.name ||
    "Training Program";

  const getStatus = (m) => m?.status || "PENDING";
  const getFees = (m) => Number(m?.batch?.program?.fees) || 0;

  // =========================
  // LOAD RAZORPAY SCRIPT
  // =========================
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePayment = async (membershipItem) => {
    if (!membershipItem?.id) {
      toast.error("Membership ID not found");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      setPaymentLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const orderResponse = await fetch(
        `http://localhost:8080/api/v1/payment/create-order/${membershipItem.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData?.data) {
        toast.error(orderData?.message || "Unable to create payment order");
        return;
      }

      const order = orderData.data;

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Ignite Sports Academy",
        description: `${getPlanName(membershipItem)} Membership`,
        order_id: order.orderId,

        handler: async function (paymentResponse) {
          try {
            toast.info("Payment successful. Verifying payment...");

            const verifyUrl =
              `http://localhost:8080/api/v1/payment/verify` +
              `?membershipId=${membershipItem.id}` +
              `&razorpayOrderId=${paymentResponse.razorpay_order_id}` +
              `&razorpayPaymentId=${paymentResponse.razorpay_payment_id}` +
              `&razorpaySignature=${paymentResponse.razorpay_signature}`;

            const verifyResponse = await fetch(verifyUrl, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              toast.success(
                verifyData?.message || "Payment verified successfully!"
              );
              await fetchMembership();
            } else {
              toast.error(
                verifyData?.message || "Payment verification failed"
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: getLoggedInUser()?.username || "Player",
          email: membershipItem?.player?.email || "",
          contact: membershipItem?.player?.phone || ""
        },

        theme: {
          color: "#0d6efd"
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(response.error?.description || "Payment failed");
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong during payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredMemberships = memberships
    .filter((m) => {
      const q = searchText.toLowerCase().trim();
      const pName = getPlanName(m).toLowerCase();
      const matchSearch = !q || pName.includes(q);
      const matchStatus = statusFilter === "ALL" || getStatus(m) === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortBy === "planName") {
        valA = getPlanName(a).toLowerCase();
        valB = getPlanName(b).toLowerCase();
      } else if (sortBy === "fees") {
        valA = getFees(a);
        valB = getFees(b);
        return sortOrder === "asc" ? valA - valB : valB - valA;
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
    setSortBy("planName");
    setSortOrder("asc");
  };

  return (
    <>
      <PlayerNavbar />

      <div className="container mt-4 mb-5" style={{ maxWidth: "1140px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 bg-white">
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 text-dark">My Membership Details</h2>
            <button
              type="button"
              className="btn btn-outline-primary px-3 rounded-3"
              onClick={fetchMembership}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {/* Search, Filter, Sort Row */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">
                <i className="bi bi-search me-1"></i> Search Plan
              </label>
              <input
                type="text"
                className="form-control bg-light"
                placeholder="Program or plan name..."
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
                <option value="PENDING">PENDING</option>
                <option value="EXPIRED">EXPIRED</option>
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
                <option value="planName">Plan Name</option>
                <option value="fees">Fees</option>
                <option value="startDate">Start Date</option>
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
              Showing <strong>{filteredMemberships.length}</strong> of{" "}
              <strong>{memberships.length}</strong> memberships
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
                  <th className="py-3 px-3">Plan Name</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">End Date</th>
                  <th className="py-3 px-3">Fees</th>
                  <th className="py-3 px-3">Action</th>
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
                      Loading Memberships...
                    </td>
                  </tr>
                ) : filteredMemberships.length > 0 ? (
                  filteredMemberships.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="fw-semibold text-secondary">
                        {index + 1}
                      </td>
                      <td className="fw-bold text-dark">{getPlanName(item)}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "ACTIVE"
                              ? "bg-success"
                              : item.status === "PENDING"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {item.status || "PENDING"}
                        </span>
                      </td>
                      <td className="text-muted">{item.start_date || "-"}</td>
                      <td className="text-muted">{item.end_date || "-"}</td>
                      <td className="fw-bold text-success">
                        ₹{item.batch?.program?.fees || "0"}
                      </td>
                      <td>
                        {item.status === "PENDING" ? (
                          <button
                            className="btn btn-primary btn-sm px-3 rounded-2"
                            onClick={() => handlePayment(item)}
                            disabled={paymentLoading}
                          >
                            {paymentLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                ></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-credit-card me-1"></i> Pay Now
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-success fw-bold small">
                            <i className="bi bi-check-circle me-1"></i> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-muted">
                      No Memberships Found
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