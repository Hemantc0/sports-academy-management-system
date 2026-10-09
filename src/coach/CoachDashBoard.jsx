import React from "react";
import { Link, Outlet } from "react-router-dom";
import CoachNavbar from "./CoachNavbar";

export default function CoachDashboard() {

    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <>
            <CoachNavbar />

            <div className="container mt-4">
                <div className="mb-4">
                    <h2 className="fw-bold text-white">
                        Welcome, Coach {loggedInUser?.username}
                    </h2>

                    <p className="text-white">
                        Manage your batches, players and training programs.
                    </p>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <i className="fa-solid fa-people-group fa-3x mb-3 text-primary"></i>
                                <h5 className="card-title">
                                    My Batches
                                </h5>
                                <p className="card-text text-muted">
                                    View and manage your assigned batches.
                                </p>
                                <Link
                                    to="/coach/my-batches"
                                    className="btn btn-primary"
                                >
                                    View Batches
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <i className="fa-solid fa-users fa-3x mb-3 text-success"></i>
                                <h5 className="card-title">
                                    My Players
                                </h5>
                                <p className="card-text text-muted">
                                    View players assigned to your batches.
                                </p>
                                <Link
                                    to="/coach/my-players"
                                    className="btn btn-success"
                                >
                                    View Players
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body text-center">
                                <i className="fa-solid fa-dumbbell fa-3x mb-3 text-warning"></i>
                                <h5 className="card-title">
                                    Training Programs
                                </h5>
                                <p className="card-text text-muted">
                                    View available training programs.
                                </p>
                                <Link
                                    to="/coach/training-programs"
                                    className="btn btn-warning"
                                >
                                    View Programs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card shadow-sm mt-4">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">
                            <i className="fa-solid fa-circle-info me-2"></i>
                            Coach Information
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <strong>
                                    Username:
                                </strong>{" "}
                                {loggedInUser?.username}
                            </div>
                            <div className="col-md-6 mb-2">
                                <strong>
                                    Role:
                                </strong>{" "}
                                {loggedInUser?.role}
                            </div>
                        </div>
                    </div>
                </div>
                <Outlet />

            </div>
        </>
    );
}

