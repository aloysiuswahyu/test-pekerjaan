"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {

  const router = useRouter();

  const logout = async () => {

    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");
  };

  return (

    <div className="container-fluid">

      <div className="row">

        <div className="col-md-2 bg-dark min-vh-100 text-white p-3">

          <h4>Admin Panel</h4>

          <hr />

          <ul className="nav flex-column">

            <li className="nav-item mb-2">
              <Link
                href="/dashboard"
                className="nav-link text-white"
              >
                Dashboard
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                href="/users"
                className="nav-link text-white"
              >
                Users
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link
                href="/pegawai"
                className="nav-link text-white"
              >
                Pegawai
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-danger btn-sm"
                onClick={logout}
              >
                Logout
              </button>
            </li>

          </ul>

        </div>

        <div className="col-md-10 p-4">
          {children}
        </div>

      </div>

    </div>
  );
}