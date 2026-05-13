"use client";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import api from "@/services/api";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { toast } from "react-toastify";

export default function PegawaiPage() {

  const [pegawai, setPegawai] =  useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

 
  const fetched = useRef(false);

  const getPegawai = async () => {

    setLoading(true);

    try {

      const res = await api.get("/employee/list");

      setPegawai(res.data || []);

    } catch (err) {


      toast.error(
        "Gagal mengambil data pegawai",
        {
          toastId: "pegawai-error",
        }
      );

    } finally {

      setLoading(false);

    }
  };

  const filteredItems = pegawai.filter(
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

  const deletePegawai = async (id) => {

    const confirmDelete = confirm( "Hapus pegawai?");

    if (!confirmDelete) return;

    try {

      await api.delete(`/employee/delete/${id}` );

      toast.success(
        "Pegawai berhasil dihapus"
      );

      getPegawai();

    } catch (err) {

      
      toast.error(
        "Gagal menghapus pegawai",
        {
          toastId: "delete-pegawai",
        }
      );
    }
  };

  useEffect(() => {

    if (fetched.current) return;
    fetched.current = true;
    getPegawai();

  }, []);

  const columns = [

    {
      name: "No",
      width: "80px",
      cell: (row, index) => index + 1,
    },

    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },

    {
      name: "Action",
      width: "240px",
      cell: (row) => (

        <div className="d-flex gap-2">
          <Link
            href={`/pegawai/edit/${row.id}`}
            className="btn btn-warning btn-sm rounded-3"
          >
            <i className="bi bi-pencil-square"></i>
          </Link>
          <button
            className="btn btn-danger btn-sm rounded-3"
            onClick={() =>
              deletePegawai(row.id)
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
              Data Pegawai
            </h4>

            <Link
              href="/pegawai/add"
              className="btn btn-primary rounded-3"
            >

              <i className="bi bi-plus-lg me-2"></i>

              Tambah Pegawai

            </Link>

          </div>

          <div className="row mb-3">

            <div className="col-md-4">

              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Cari pegawai..."
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
                Data pegawai kosong
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