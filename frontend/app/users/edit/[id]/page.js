
"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import api from "@/services/api";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { handleApiError }
from "@/utils/handleApiError";

import { toast }
from "react-toastify";

import {
  useForm,
} from "react-hook-form";

import { yupResolver }
from "@hookform/resolvers/yup";

import * as yup from "yup";

// validation
const schema = yup.object({

  username: yup
    .string()
    .required("Username wajib diisi"),

    password: yup
    .string() 
    .test( "password-length", "Password minimal 6 karakter", (value) =>
       { 
        // boleh kosong 
        if (!value || value.length === 0) { return true; }
         // kalau diisi minimal 6 
         return value.length >= 6; 
        } 
    ),

});

export default function EditUserPage() {

  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, setError,formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  // get detail user
  const getUser = async () => {

    try {

      const res = await api.get(`/user/show/${params.id}`);

      const user = res.data.data;

      setValue("username", user.username);

      // password kosong saat edit
      setValue("password", "");

    } catch (err) {

      toast.error(
        "Gagal mengambil data user"
      );

    }
  };

  // submit update
  const submit = async (data) => {

    setLoading(true);

    try {

      // hapus password jika kosong
      if (!data.password) {
        delete data.password;
      }

      await api.put(`/user/edit/${params.id}`, data);

      toast.success(
        "User berhasil diupdate"
      );

      setTimeout(() => {
        router.push("/users");
      }, 1000);

    } catch (err) {

      handleApiError(
        err,
        setError,
        "Gagal ubah user"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (params?.id) {
      getUser();
    }

  }, [params.id]);

  return (

    <Layout>

      <div className="container-fluid">

        <div className="row justify-content-center">

          <div className="col-md-8">

            <div className="card border-0 shadow-sm">

              <div className="card-header bg-dark text-white">

                <h5 className="mb-0">

                  <i className="bi bi-pencil-square me-2"></i>

                  Edit User

                </h5>

              </div>

              <div className="card-body">

                <form
                  onSubmit={handleSubmit(submit)}
                >

                  {/* username */}
                  <div className="mb-3">

                    <label className="form-label">
                      Username
                    </label>

                    <input
                      type="text"
                      className={`form-control ${
                        errors.username
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Masukkan username"
                      {...register("username")}
                    />

                    <div className="invalid-feedback">

                      {errors.username?.message}

                    </div>

                  </div>

                  {/* password */}
                  <div className="mb-3">

                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className={`form-control ${
                        errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Kosongkan jika tidak diubah"
                      {...register("password")}
                    />

                    <div className="invalid-feedback">

                      {errors.password?.message}

                    </div>

                  </div>

                  {/* button */}
                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >

                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                          ></span>

                          Loading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>

                          Update
                        </>
                      )}

                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        router.push("/users")
                      }
                    >

                      Kembali

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}