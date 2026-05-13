"use client";

import Layout from "@/components/Layout";
import api from "@/services/api";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { handleApiError } from "@/utils/handleApiError";

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

export default function AddUserPage() {

  const router = useRouter();

  const { register, handleSubmit, setError, formState: { errors } } = useForm({resolver: yupResolver(schema)});

  const submit = async (data) => {

    try {

      await api.post("/user/create",data);

      toast.success(
        "User berhasil ditambah"
      );

      router.push("/users");

    } catch (err) {

      /*
       * validation dari backend
       */
     
      if (
        err.response &&
        err.response.status === 422
      ) {

        const apiErrors = err.response.data.errors;

        Object.keys(apiErrors).forEach(
          (field) => {

            setError(
              field, 
              {
                type: "server",
                message: apiErrors[field],
              }
            );

            handleApiError(
              err,
              setError,
              err.response.data.message
            );
            

          }
        );

      } else {

        toast.error(
          "Terjadi kesalahan"
        );

      }
    }
  };

  return (

    <Layout>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <h4 className="fw-bold mb-4">
            Tambah User
          </h4>

          <form
            onSubmit={handleSubmit(submit)}
          >

            <div className="mb-3">

              <label>
                Username
              </label>

              <input
                type="text"
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

            <div className="mb-4">

              <label>
                Password
              </label>

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

            <button className="btn btn-primary">

              Simpan

            </button>

          </form>

        </div>

      </div>

    </Layout>
  );
}