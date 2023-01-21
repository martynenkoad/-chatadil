import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import crocodile from "../assets/crocodile.png"

export default function Page404() {

    const { user } = useSelector((state) => state.auth)

    return (
        <div className="page-404">
            <h1>404: Page Not Found</h1>
            <p>Are you lost? Don't worry! Follow Chatadil to get:</p>
            {
                !user &&
                <div className="routes">
                    <Link to="/signup">
                        <span className="material-symbols-outlined">
                            login
                        </span>
                        Sign Up
                    </Link>
                    <Link to="/login">
                        <span className="material-symbols-outlined">
                            login
                        </span>
                        Log In
                    </Link>
                </div>
            }
            {
                user &&
                <div className="routes">
                    <Link to="/">
                        <span className="material-symbols-outlined">
                            home
                        </span>
                        Home
                    </Link>
                    <Link to="/chat">
                        <span className="material-symbols-outlined">
                            group
                        </span>
                        Chat Page
                    </Link>
                    <Link to="/settings">
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                        Settings
                    </Link>
                </div>
            }
            <img 
              src={crocodile}
              alt=""
            />
        </div>
    )
}