import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CoachProfile() {

    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        fetchCoachProfile();
    }, []);

    const fetchCoachProfile = async () => {

        try {

            if (!loggedInUser || !loggedInUser.id) {
                toast.error("Coach information not found");
                return;
            }

            const response = await fetch(
                `http://localhost:8080/api/v1/get/coach/user/${loggedInUser.id}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${loggedInUser.jwtToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch coach profile");
            }

            const result = await response.json();

            console.log("Coach Profile:", result);

            setCoach(result.data);

        } catch (error) {

            console.error(error);
            toast.error("Unable to load coach profile");

        } finally {

            setLoading(false);

        }
    };


    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border"></div>
                <p className="mt-2 text-white">
                    Loading profile...
                </p>
            </div>
        );
    }


    return (
        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-dark text-white">

                    <h4 className="mb-0">
                        <i className="fa-solid fa-user-tie me-2"></i>
                        Coach Profile
                    </h4>

                </div>


                <div className="card-body">

                    {coach ? (

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <strong>
                                    Name:
                                </strong>

                                <p className="form-control">
                                    {coach.name || "-"}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Username:
                                </strong>

                                <p className="form-control">
                                    {loggedInUser?.username || "-"}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Email:
                                </strong>

                                <p className="form-control">
                                    {coach.email || "-"}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Phone:
                                </strong>

                                <p className="form-control">
                                    {coach.phone || "-"}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Specialization:
                                </strong>

                                <p className="form-control">
                                    {coach.specialization || "-"}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Role:
                                </strong>

                                <p className="form-control">
                                    {loggedInUser?.role || "-"}
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="alert alert-info">
                            Coach profile not found.
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}