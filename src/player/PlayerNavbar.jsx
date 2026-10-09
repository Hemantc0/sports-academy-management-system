import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PlayerNavbar() {

    const navigateTo = useNavigate();

    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );


    function handleLogout() {

        localStorage.removeItem("user");

        navigateTo("/", {
            replace: true
        });
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">


                <Link
                    className="navbar-brand fw-bold"
                    to="/player"
                >
                    <i className="fa-solid fa-futbol me-1"></i>
                    Ignite_Sports_Academy
                </Link>



                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#playerNavbar"
                    aria-controls="playerNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span className="navbar-toggler-icon"></span>

                </button>



                <div
                    className="collapse navbar-collapse"
                    id="playerNavbar"
                >

                    <ul className="navbar-nav ms-auto">


                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/player"
                            >
                                Dashboard
                            </Link>

                        </li>



                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/player/profile"
                            >
                                Profile
                            </Link>

                        </li>



                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/player/membership"
                            >
                                Membership
                            </Link>

                        </li>



                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/player/my-batches"
                            >
                                My Batches
                            </Link>

                        </li>



                        <li className="nav-item">

                            <Link
                                className="nav-link"
                                to="/player/payments"
                            >
                                Payments
                            </Link>

                        </li>



                        {loggedInUser && (

                            <li className="nav-item">

                                <button
                                    className="btn btn-danger btn-sm mt-1 ms-lg-2"
                                    onClick={handleLogout}
                                >

                                    <i className="fa-solid fa-right-from-bracket me-1"></i>

                                    Logout

                                </button>

                            </li>

                        )}

                    </ul>

                </div>

            </div>

        </nav>
    );
}