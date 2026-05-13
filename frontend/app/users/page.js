"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";

import api from "@/services/api";

import Link from "next/link";

import DataTable from "react-data-table-component";

import { toast } from "react-toastify";

export default function UserPage() {

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filterText, setFilterText] =
    useState("");

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    setLoading(true);

    try {

      const res = await api.get(
        "/user/list"
      );

      // default array jika null
      setUsers(res.data.data || []);

    } catch (err) {

      console.log(err);

      toast.error(
        "Gagal load user"
      );

    } finally {

      setLoading(false);

    }
  };

  const filteredItems = users.filter(
    (item) =>

      item.name
        ?.toLowerCase()
        .includes(
          filterText.toLowerCase()
        ) ||

      item.username
        ?.toLowerCase()
        .includes(
          filterText.toLowerCase()
        )
  );

  const LoadingComponent = () => {

    return (

      <div className="p-4 w-100">

        {[1,2,3,4,5].map((item) => (

          <div
            key={item}
            className="placeholder-glow mb-3"
          >

            <span className="placeholder col-12 py-3 rounded"></span>

          </div>

        ))}

      </div>

    );
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus user ini?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/user/delete/${id}`
      );

      toast.success(
        "User berhasil dihapus"
      );

      fetchUsers();

    } catch (err) {

      console.log(err);

      toast.error(
        "Gagal menghapus user"
      );
    }
  };

  const columns = [

    {
      name: "No",

      width: "80px",

      cell: (row, index) =>
        index + 1,
    },

    {
      name: "Username",

      selector: (row) =>
        row.username,

      sortable: true,
    },

    {
      name: "Action",

      width: "240px",

      cell: (row) => (

        <div className="d-flex gap-2">

          <Link
            href={`/users/edit/${row.id}`}
            className="btn btn-warning btn-sm rounded-3"
          >

            <i className="bi bi-pencil-square"></i>

          </Link>

          <button
            className="btn btn-danger btn-sm rounded-3"
            onClick={() =>
              handleDelete(row.id)
            }
          >

            <i className="bi bi-trash"></i>

          </button>

        </div>

      ),
    },
  ];

  return (

    <Layout>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h4 className="fw-bold mb-0">
              Data User
            </h4>

            <Link
              href="/users/add"
              className="btn btn-primary rounded-3"
            >

              <i className="bi bi-plus-lg me-2"></i>

              Tambah User

            </Link>

          </div>

          <div className="row mb-3">

            <div className="col-md-4">

              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Cari user..."
                value={filterText}
                onChange={(e) =>
                  setFilterText(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <DataTable
            columns={columns}
            data={filteredItems}
            progressPending={loading}
            progressComponent={
              <LoadingComponent />
            }
            noDataComponent={
              <div className="py-4">
                Data user kosong
              </div>
            }
            pagination
            highlightOnHover
            striped
            responsive
            persistTableHead
          />

        </div>

      </div>

    </Layout>
  );
}