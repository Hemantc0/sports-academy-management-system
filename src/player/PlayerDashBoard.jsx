import React from "react";
import { Link, Outlet } from "react-router-dom";
import PlayerNavbar from "./PlayerNavbar";

export default function PlayerDashboard() {

  // Get logged-in user
  const getLoggedInUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return {};
      }

      return JSON.parse(user);

    } catch (error) {
      console.error("Error reading logged-in user:", error);
      return {};
    }
  };


  const loggedInUser = getLoggedInUser();


  return (
    <>
 
      <PlayerNavbar />


      <div className="container mt-4 mb-5">



        <div className="mb-4">

          <h2 className="fw-bold text-white">
            Welcome, {loggedInUser?.username || "Player"}
          </h2>

          <p className="text-white">
            Manage your membership, batches and payments.
          </p>

        </div>



        <div className="row g-4">



          <div className="col-12 col-sm-6 col-lg-3">

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                <i className="fa-solid fa-user fa-3x mb-3 text-primary"></i>

                <h5 className="card-title">
                  My Profile
                </h5>

                <p className="card-text text-muted">
                  View your profile information.
                </p>

                <Link
                  to="/player/profile"
                  className="btn btn-primary"
                >
                  View Profile
                </Link>

              </div>

            </div>

          </div>


          <div className="col-12 col-sm-6 col-lg-3">

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                <i className="fa-solid fa-id-card fa-3x mb-3 text-success"></i>

                <h5 className="card-title">
                  My Membership
                </h5>

                <p className="card-text text-muted">
                  View your membership details.
                </p>

                <Link
                  to="/player/membership"
                  className="btn btn-success"
                >
                  View Membership
                </Link>

              </div>

            </div>

          </div>



          <div className="col-12 col-sm-6 col-lg-3">

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                <i className="fa-solid fa-people-group fa-3x mb-3 text-warning"></i>

                <h5 className="card-title">
                  My Batches
                </h5>

                <p className="card-text text-muted">
                  View your assigned batches.
                </p>

                <Link
                  to="/player/my-batches"
                  className="btn btn-warning"
                >
                  View Batches
                </Link>

              </div>

            </div>

          </div>



          <div className="col-12 col-sm-6 col-lg-3">

            <div className="card shadow-sm h-100">

              <div className="card-body text-center">

                <i className="fa-solid fa-credit-card fa-3x mb-3 text-danger"></i>

                <h5 className="card-title">
                  Payments
                </h5>

                <p className="card-text text-muted">
                  View your payment details.
                </p>

                <Link
                  to="/player/payments"
                  className="btn btn-danger"
                >
                  View Payments
                </Link>

              </div>

            </div>

          </div>

        </div>



        <div className="card shadow-sm mt-4">

          <div className="card-header bg-dark text-white">

            <h5 className="mb-0">

              <i className="fa-solid fa-circle-info me-2"></i>

              Player Information

            </h5>

          </div>


          <div className="card-body">

            <div className="row">

              {/* USERNAME */}

              <div className="col-md-6 mb-2">

                <strong>
                  Username:
                </strong>{" "}

                {loggedInUser?.username || "N/A"}

              </div>


              {/* ROLE */}

              <div className="col-md-6 mb-2">

                <strong>
                  Role:
                </strong>{" "}

                {loggedInUser?.role || "PLAYER"}

              </div>

            </div>

          </div>

        </div>




        <div className="mt-4">

          <Outlet />

        </div>


      </div>
    </>
  );
}
