"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}) {

  const router = useRouter();

  const logout = () => {

    Cookies.remove("token");

    router.push("/");
  };

  return (

    <div className="d-flex">

      <div
        className="bg-dark text-white p-4"
        style={{
          width: "250px",
          minHeight: "100vh",
        }}
      >

        <h3 className="fw-bold mb-4">
          Admin Panel
        </h3>

        <ul className="nav flex-column gap-2">

          <li className="nav-item">

            <Link
              href="/dashboard"
              className="nav-link text-white"
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Link>

          </li>

          <li className="nav-item">

            <Link
              href="/users"
              className="nav-link text-white"
            >
              <i className="bi bi-people me-2"></i>
              User
            </Link>

          </li>

          <li className="nav-item">

            <Link
              href="/pegawai"
              className="nav-link text-white"
            >
              <i className="bi bi-person-badge me-2"></i>
              Pegawai
            </Link>

          </li>

        </ul>

      </div>

      <div className="flex-grow-1">

        <nav className="navbar bg-white shadow-sm px-4">

          <div className="ms-auto">

            <button
              onClick={logout}
              className="btn btn-danger rounded-3"
            >
              Logout
            </button>

          </div>

        </nav>

        <div className="p-4">

          {children}

        </div>

      </div>

    </div>
  );
}