import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CoachNavbar() {

    const navigateTo = useNavigate();

    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );

    function handleLogout() {

        localStorage.removeItem("user");

        navigateTo("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">
                <Link
                    className="navbar-brand fw-bold"
                    to="/coach"
                >
                    <i className="fa-solid fa-futbol me-1"></i>
                    Ignite_Sports_Academy
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#coachNavbar"
                    aria-controls="coachNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="coachNavbar"
                >

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/coach"
                            >
                                <i className="fa-solid fa-gauge me-1"></i>
                                Dashboard
                            </Link>

                        </li>

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/coach/my-batches"
                            >
                                <i className="fa-solid fa-people-group me-1"></i>
                                My Batches
                            </Link>

                        </li>

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/coach/my-players"
                            >
                                <i className="fa-solid fa-users me-1"></i>
                                My Players
                            </Link>

                        </li>

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/coach/training-programs"
                            >
                                <i className="fa-solid fa-dumbbell me-1"></i>
                                Training Programs
                            </Link>

                        </li>

                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/coach/profile"
                            >
                                <i className="fa-solid fa-user-tie me-1"></i>
                                Profile
                            </Link>

                        </li>

                        <li className="nav-item">

                            <button
                                className="btn btn-danger btn-sm mt-1 ms-lg-2"
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-right-from-bracket me-1"></i>
                                Logout
                            </button>

                        </li>

                    </ul>

                </div>

            </div>

        </nav>
    );
}
