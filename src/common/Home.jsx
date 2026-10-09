import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  const isRootPage = location.pathname === "/";

  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container">

          <Link
            className="navbar-brand fw-bold fs-4"
            to="/"
          >
            <i className="fa-solid fa-futbol me-2 text-warning"></i>
            Ignite_Sports_Academy
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#homeNavbar"
            aria-controls="homeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="homeNavbar"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link
                  className="nav-link px-3"
                  to="/"
                >
                  <i className="fa-solid fa-house me-1"></i>
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link px-3"
                  to="/register"
                >
                  <i className="fa-solid fa-user-plus me-1"></i>
                  Register
                </Link>
              </li>

              <li className="nav-item ms-lg-2">
                <Link
                  className="btn btn-warning px-4 fw-semibold"
                  to="/login"
                >
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  Login
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>


   

      {isRootPage && (
        <>

      

          <section
            className="py-5"
            style={{
              background:
                "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
              minHeight: "650px",
              display: "flex",
              alignItems: "center"
            }}
          >

            <div className="container">

              <div className="row align-items-center g-5">

                {/* LEFT */}
                <div className="col-lg-7 text-white">

                  <span className="badge bg-warning text-dark px-3 py-2 mb-3">
                    <i className="fa-solid fa-trophy me-2"></i>
                    Train • Compete • Succeed
                  </span>

                  <h1 className="display-3 fw-bold mb-3">
                    Build Your
                    <span className="text-warning">
                      {" "}Game.
                    </span>
                    <br />
                    Become Your
                    <span className="text-success">
                      {" "}Best.
                    </span>
                  </h1>

                  <p className="lead text-light opacity-75 mb-4">
                    Welcome to Ignite Sports Academy — a complete
                    platform to manage sports training, coaches,
                    players, batches, memberships and payments.
                  </p>

                  <div className="d-flex flex-wrap gap-3">

                    <Link
                      to="/register"
                      className="btn btn-warning btn-lg px-4 fw-semibold"
                    >
                      <i className="fa-solid fa-user-plus me-2"></i>
                      Join Academy
                    </Link>

                    <Link
                      to="/login"
                      className="btn btn-outline-light btn-lg px-4"
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>
                      Login
                    </Link>

                  </div>


                  <div className="row mt-5 g-3">

                    <div className="col-4">
                      <div className="border-start border-warning border-3 ps-3">
                        <h3 className="fw-bold mb-0">10+</h3>
                        <small className="text-light opacity-75">
                          Sports
                        </small>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="border-start border-success border-3 ps-3">
                        <h3 className="fw-bold mb-0">50+</h3>
                        <small className="text-light opacity-75">
                          Players
                        </small>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="border-start border-info border-3 ps-3">
                        <h3 className="fw-bold mb-0">10+</h3>
                        <small className="text-light opacity-75">
                          Coaches
                        </small>
                      </div>
                    </div>

                  </div>

                </div>



                <div className="col-lg-5">

                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

                    <div
                      className="p-5 text-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #facc15, #f59e0b)"
                      }}
                    >

                      <i
                        className="fa-solid fa-futbol"
                        style={{
                          fontSize: "100px"
                        }}
                      ></i>

                      <h3 className="fw-bold mt-4">
                        Ignite Your Potential
                      </h3>

                      <p className="mb-0">
                        Train with purpose. Play with passion.
                      </p>

                    </div>

                    <div className="card-body p-4">

                      <div className="d-flex align-items-center mb-3">
                        <i className="fa-solid fa-dumbbell text-warning fs-4 me-3"></i>
                        <div>
                          <h6 className="mb-0 fw-bold">
                            Professional Training
                          </h6>
                          <small className="text-muted">
                            Structured training programs
                          </small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <i className="fa-solid fa-users text-success fs-4 me-3"></i>
                        <div>
                          <h6 className="mb-0 fw-bold">
                            Expert Coaches
                          </h6>
                          <small className="text-muted">
                            Experienced coaching support
                          </small>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-chart-line text-primary fs-4 me-3"></i>
                        <div>
                          <h6 className="mb-0 fw-bold">
                            Track Your Progress
                          </h6>
                          <small className="text-muted">
                            Manage your sports journey
                          </small>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          </section>


          <section className="py-5 bg-light">

            <div className="container">

              <div className="text-center mb-5">

                <span className="text-warning fw-semibold">
                  WHY IGNITE?
                </span>

                <h2 className="fw-bold mt-2">
                  Everything You Need in One Place
                </h2>

                <p className="text-muted">
                  A simple and organized platform for your entire
                  sports academy.
                </p>

              </div>


              <div className="row g-4">

                {[
                  {
                    icon: "fa-solid fa-dumbbell",
                    title: "Training Programs",
                    text: "Create and manage structured sports training programs."
                  },
                  {
                    icon: "fa-solid fa-users",
                    title: "Batch Management",
                    text: "Organize players into batches with assigned coaches."
                  },
                  {
                    icon: "fa-solid fa-id-card",
                    title: "Memberships",
                    text: "Manage player memberships and their validity."
                  },
                  {
                    icon: "fa-solid fa-credit-card",
                    title: "Payments",
                    text: "Keep track of membership payments and transactions."
                  },
                  {
                    icon: "fa-solid fa-user-tie",
                    title: "Coach Management",
                    text: "Manage coaches, specializations and assigned batches."
                  },
                  {
                    icon: "fa-solid fa-chart-simple",
                    title: "Academy Management",
                    text: "Manage players, branches, sports and programs efficiently."
                  }
                ].map((feature, index) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={index}
                  >

                    <div
                      className="card h-100 border-0 shadow-sm rounded-4 p-3"
                    >

                      <div className="card-body">

                        <div
                          className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center mb-4"
                          style={{
                            width: "60px",
                            height: "60px"
                          }}
                        >
                          <i
                            className={`${feature.icon} text-warning fs-4`}
                          ></i>
                        </div>

                        <h5 className="fw-bold">
                          {feature.title}
                        </h5>

                        <p className="text-muted mb-0">
                          {feature.text}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>
          <section className="py-5 bg-dark text-white">

            <div className="container">

              <div className="text-center mb-5">

                <h2 className="fw-bold">
                  One Platform. Three Roles.
                </h2>

                <p className="text-light opacity-75">
                  Designed for everyone involved in academy management.
                </p>

              </div>


              <div className="row g-4">

                {[
                  {
                    icon: "fa-solid fa-user-shield",
                    title: "Admin",
                    text: "Manage academy operations, players, coaches, batches, memberships and payments."
                  },
                  {
                    icon: "fa-solid fa-person-chalkboard",
                    title: "Coach",
                    text: "View assigned batches, players and training programs."
                  },
                  {
                    icon: "fa-solid fa-person-running",
                    title: "Player",
                    text: "View your profile, batches, memberships and payment details."
                  }
                ].map((role, index) => (

                  <div
                    className="col-md-4"
                    key={index}
                  >

                    <div className="border border-secondary rounded-4 p-4 h-100">

                      <i
                        className={`${role.icon} text-warning fs-1 mb-3`}
                      ></i>

                      <h4 className="fw-bold">
                        {role.title}
                      </h4>

                      <p className="text-light opacity-75 mb-0">
                        {role.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>


          <section className="py-5 bg-warning">

            <div className="container text-center">

              <h2 className="fw-bold">
                Ready to Ignite Your Potential?
              </h2>

              <p className="mb-4">
                Join Ignite Sports Academy and start your journey today.
              </p>

              <Link
                to="/register"
                className="btn btn-dark btn-lg px-5"
              >
                <i className="fa-solid fa-user-plus me-2"></i>
                Get Started
              </Link>

            </div>

          </section>


          <footer className="bg-dark text-white py-4">

            <div className="container">

              <div className="row align-items-center">

                <div className="col-md-6">

                  <h5 className="fw-bold mb-1">
                    <i className="fa-solid fa-futbol text-warning me-2"></i>
                    Ignite_Sports_Academy
                  </h5>

                  <small className="text-light opacity-75">
                    Sports Academy Management System
                  </small>

                </div>

                <div className="col-md-6 text-md-end mt-3 mt-md-0">

                  <Link
                    to="/login"
                    className="text-white text-decoration-none me-3"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="text-white text-decoration-none"
                  >
                    Register
                  </Link>

                </div>

              </div>

              <hr className="border-secondary" />

              <div className="text-center">

                <small className="text-light opacity-75">
                  © {new Date().getFullYear()} Ignite Sports Academy.
                  All Rights Reserved.
                </small>

              </div>

            </div>

          </footer>

        </>
      )}

      <Outlet />
    </>
  );
}