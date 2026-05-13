"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";
import * as yup from "yup";

const schema = yup.object({

  username: yup
    .string()
    .required("Username wajib diisi"),

  password: yup
    .string()
    .min(6, "Minimal 6 karakter")
    .required("Password wajib diisi"),

});

export default function LoginPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },

  } = useForm({
    resolver: yupResolver(schema),
  });

  const submit = async (data) => {

    setLoading(true);

    try {

      const res = await api.post(
        "/login",
        data
      );

      Cookies.set("token", res.data.token, {
        expires: 1,
      });

      toast.success("Login berhasil");

      setTimeout(() => {
        router.push("/users");
      }, 1000);

    } catch (err) {

      if (  err.response &&  err.response.status === 422 ) 
      {

        const apiErrors = err.response.data.messages;

        Object.keys(apiErrors).forEach(
          (field) => {

            setError(field, {
              type: "server",
              message: apiErrors[field],
            });

          }
        );

        toast.error("Validation error");

      } else if ( err.response && err.response.status === 401) {

        toast.error(
          "Username atau password salah"
        );

      } else if ( !err.response ) {

        toast.error(
          "Tidak dapat terhubung ke server. Periksa jaringan atau konfigurasi API."
        );

      } else {

        toast.error(
          "Terjadi kesalahan server"
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Login
              </h3>

              <form
                onSubmit={handleSubmit(submit)}
              >

                <div className="mb-3">

                  <label>Username</label>

                  <input
                    type="username"
                    className={`form-control ${
                      errors.username
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("username")}
                  />

                  <div className="invalid-feedback">
                    {errors.username?.message}
                  </div>

                </div>

                <div className="mb-3">

                  <label>Password</label>

                  <input
                    type="password"
                    className={`form-control ${
                      errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    {...register("password")}
                  />

                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>

                </div>

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >

                  {loading
                    ? "Loading..."
                    : "Login"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}