import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminNavbar() {
    let navigateTo=useNavigate()
    
      function handleLogout()
      {
        localStorage.removeItem("user")
        navigateTo("/",{ replace: true })
      }
  return (
    <div> <div>
    
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/admin"}><strong><i className="fa-regular fa-futbol me-1"></i> Ignite_Sports_Academy</strong></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-sports"}>Sports</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-coaches"}>Coaches</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-players"}>Players</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-batches"}>Batches</Link>
            </li>
            
             <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-memberships"}>Membership</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-trainingprograms"}>Trainingprograms</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={"/admin/manage-payments"}>Payments</Link>
            </li>
          </ul>
           
          <div>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" onClick={handleLogout}>Logout</Link>
              </li>
            
          </ul>
          </div>
        </div>
      </div>
    </nav>
    
        </div>
    </div>
  )
}
