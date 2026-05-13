"use client";

import { useRef, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-cropper";
import Layout from "@/components/Layout";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleApiError } from "@/utils/handleApiError";
import * as yup from "yup";

const schema = yup.object({
  nip: yup
    .string()
    .required("NIP wajib diisi"),

    name: yup
    .string()
    .required("Nama wajib diisi"),

  jabatan: yup
    .string()
    .required("Jabatan wajib diisi"),

  alamat: yup
    .string()
    .required("Alamat wajib diisi"),

  image: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Format gambar harus JPG / PNG",
      (value) => {
        if (!value) return true;

        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
        ].includes(value.type);
      }
    )
    .test(
      "fileSize",
      "Ukuran gambar maksimal 2MB",
      (value) => {
        if (!value) return true;

        return value.size <= 2 * 1024 * 1024;
      }
    ),
});

export default function AddPegawaiPage() {

  const router = useRouter();

  const cropperRef = useRef(null);

  const [image, setImage] = useState(null);

  const [croppedImage, setCroppedImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [isCropped, setIsCropped] = useState(false);

  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // upload image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImageError("");

    // validate type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {

      setImageError(
        "Format gambar harus JPG / PNG"
      );

      return;
    }

    // validate size
    if (file.size > 2 * 1024 * 1024) {

      setImageError(
        "Ukuran gambar maksimal 2MB"
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      setImage(reader.result);

      setCroppedImage(null);

      setIsCropped(false);
    };

    reader.readAsDataURL(file);
  };

  // crop image
  const handleCrop = () => {

    if (cropperRef.current?.cropper) {

      const canvas =
        cropperRef.current.cropper.getCroppedCanvas({
          width: 300,
          height: 300,
          imageSmoothingQuality: "high",
        });

      if (canvas) {

        const cropped =
          canvas.toDataURL("image/jpeg", 0.9);

        setCroppedImage(cropped);

        setIsCropped(true);
      }
    }
  };

  // reset crop
  const resetCrop = () => {

    setCroppedImage(null);

    setIsCropped(false);
  };

  // submit form
  const submit = async (formValues) => {

    // validasi crop
    if (image && !croppedImage) {

      setImageError(
        "Silakan crop gambar terlebih dahulu"
      );

      return;
    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append("nip", formValues.nip);

      data.append("name", formValues.name);

      data.append("jabatan", formValues.jabatan);

      data.append("alamat", formValues.alamat);

      // upload hasil crop
      if (croppedImage) {

        const blob = await fetch(croppedImage)
          .then((r) => r.blob());

        data.append(
          "foto",
          blob,
          "foto.jpg"
        );
      }

      // debug formdata
      for (let pair of data.entries()) {

        console.log(pair[0], pair[1]);
      }

      await api.post(
        "/employee/create",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Data berhasil disimpan"
      );

      router.push("/pegawai");

    } catch (err) {

      if (
        err.response &&
        err.response.status === 422
      ) {

        const apiErrors =
          err.response.data.errors;

        Object.keys(apiErrors).forEach(
          (field) => {

            setError(field, {
              type: "server",
              message: apiErrors[field],
            });
          }
        );

        handleApiError(
          err,
          setError,
          err.response.data.message
        );

      } else {

        toast.error(
          "Terjadi kesalahan"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="card shadow-sm">

        <div className="card-body">

          <h3 className="mb-4">
            Tambah Pegawai
          </h3>

          <form
            onSubmit={handleSubmit(submit)}
          >

            {/* NIP */}
            <div className="mb-3">

              <label className="form-label">
                NIP
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.nip
                    ? "is-invalid"
                    : ""
                }`}
                {...register("nip")}
              />

              <div className="invalid-feedback">
                {errors.nip?.message}
              </div>

            </div>

            {/* Nama */}
            <div className="mb-3">

              <label className="form-label">
                Nama
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.name
                    ? "is-invalid"
                    : ""
                }`}
                {...register("name")}
              />

              <div className="invalid-feedback">
                {errors.name?.message}
              </div>

            </div>

            {/* Jabatan */}
            <div className="mb-3">

              <label className="form-label">
                Jabatan
              </label>

              <input
                type="text"
                className={`form-control ${
                  errors.jabatan
                    ? "is-invalid"
                    : ""
                }`}
                {...register("jabatan")}
              />

              <div className="invalid-feedback">
                {errors.jabatan?.message}
              </div>

            </div>

            {/* Alamat */}
            <div className="mb-3">

              <label className="form-label">
                Alamat
              </label>

              <textarea
                rows="3"
                className={`form-control ${
                  errors.alamat
                    ? "is-invalid"
                    : ""
                }`}
                {...register("alamat")}
              />

              <div className="invalid-feedback">
                {errors.alamat?.message}
              </div>

            </div>

            {/* Upload */}
            <div className="mb-3">

              <label className="form-label">
                Foto
              </label>

              <input
                type="file"
                className={`form-control ${
                  imageError
                    ? "is-invalid"
                    : ""
                }`}
                accept=".jpg,.jpeg,.png"
                onChange={handleImage}
              />

              <div className="invalid-feedback">
                {imageError}
              </div>

            </div>

            {/* Cropper */}
            {image && !isCropped && (

              <div className="mb-3">

                <Cropper
                  src={image}
                  style={{
                    height: 400,
                    width: "100%",
                  }}
                  aspectRatio={1}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  cropBoxResizable={false}
                  cropBoxMovable={false}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  ref={cropperRef}
                />

                <button
                  type="button"
                  className="btn btn-dark mt-3"
                  onClick={handleCrop}
                >

                  Crop Image

                </button>

              </div>
            )}

            {/* Preview hasil crop */}
            {croppedImage && (

              <div className="mb-3">

                <label className="form-label">
                  Hasil Crop
                </label>

                <div>

                  <img
                    src={croppedImage}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="rounded border"
                  />

                </div>

                <button
                  type="button"
                  className="btn btn-secondary mt-3"
                  onClick={resetCrop}
                >

                  Crop Ulang

                </button>

              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >

              {loading
                ? "Loading..."
                : "Simpan"}

            </button>

          </form>

        </div>

      </div>

    </Layout>
  );
}