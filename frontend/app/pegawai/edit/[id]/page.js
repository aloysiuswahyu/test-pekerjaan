"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";

export default function EditPegawaiPage() {

  const params = useParams();

  const router = useRouter();

  const cropperRef = useRef(null);

  const [image, setImage] = useState(null);

  const [croppedImage, setCroppedImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [isCropped, setIsCropped] = useState(true);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nip: "",
    nama: "",
    jabatan: "",
    alamat: "",
  });

  // get data pegawai
  const getPegawai = async () => {

    try {

      const res = await api.get(
        `/employee/show/${params.id}`
      );

      const pegawai = res.data.data;

      setForm({
        nip: pegawai.nip || "",
        nama: pegawai.nama || "",
        jabatan: pegawai.jabatan || "",
        alamat: pegawai.alamat || "",
      });

      // preview image lama
      if (pegawai.photo) {

        const imageUrl =
          `${process.env.NEXT_PUBLIC_API_URL}/uploads/pegawai/${pegawai.photo}`;

        setPreview(imageUrl);

        setCroppedImage(imageUrl);
      }

    } catch (err) {

      console.log(err);

      toast.error(
        "Gagal mengambil data pegawai"
      );
    }
  };

  // upload image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // reset error
    setErrors((prev) => ({
      ...prev,
      foto: "",
    }));

    // validasi type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {

      setErrors((prev) => ({
        ...prev,
        foto:
          "Format gambar harus JPG / PNG",
      }));

      return;
    }

    // validasi size
    if (file.size > 2 * 1024 * 1024) {

      setErrors((prev) => ({
        ...prev,
        foto:
          "Ukuran gambar maksimal 2MB",
      }));

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      setImage(reader.result);

      setIsCropped(false);

      setCroppedImage(null);
    };

    reader.readAsDataURL(file);
  };

  // crop image
  const handleCrop = () => {

    if (!cropperRef.current?.cropper)
      return;

    const canvas =
      cropperRef.current.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingQuality: "high",
      });

    if (canvas) {

      const cropped =
        canvas.toDataURL(
          "image/jpeg",
          0.9
        );

      setCroppedImage(cropped);

      setPreview(cropped);

      setIsCropped(true);
    }
  };

  // reset crop
  const resetCrop = () => {

    setIsCropped(false);

    setCroppedImage(null);
  };

  // validasi form
  const validateForm = () => {

    const newErrors = {};

    if (!form.nip.trim()) {
      newErrors.nip =
        "NIP wajib diisi";
    }

    if (!form.nama.trim()) {
      newErrors.nama =
        "Nama wajib diisi";
    }

    if (!form.jabatan.trim()) {
      newErrors.jabatan =
        "Jabatan wajib diisi";
    }

    if (!form.alamat.trim()) {
      newErrors.alamat =
        "Alamat wajib diisi";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // submit update
  const submit = async (e) => {

    e.preventDefault();

    // validasi form
    if (!validateForm()) {
      return;
    }

    // validasi crop
    if (image && !croppedImage) {

      setErrors((prev) => ({
        ...prev,
        foto:
          "Silakan crop gambar terlebih dahulu",
      }));

      return;
    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append("nip", form.nip);

      data.append("nama", form.nama);

      data.append(
        "jabatan",
        form.jabatan
      );

      data.append(
        "alamat",
        form.alamat
      );

      // upload hasil crop
      if (
        croppedImage &&
        croppedImage.startsWith(
          "data:image"
        )
      ) {

        const blob = await fetch(
          croppedImage
        ).then((r) => r.blob());

        data.append(
          "foto",
          blob,
          "foto.jpg"
        );
      }

      // debug formdata
      for (let pair of data.entries()) {

        console.log(
          pair[0],
          pair[1]
        );
      }

      // update data
      await api.put(
        `/employee/edit/${params.id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Pegawai berhasil diupdate"
      );

      router.push("/pegawai");

    } catch (err) {

      console.log(err);

      toast.error(
        "Gagal update pegawai"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    getPegawai();

  }, []);

  return (
    <Layout>

      <div className="card shadow-sm">

        <div className="card-body">

          <h3 className="mb-4">
            Edit Pegawai
          </h3>

          <form onSubmit={submit}>

            {/* preview image */}
            {preview && (

              <div className="mb-4">

                <label className="form-label fw-bold">
                  Foto Saat Ini
                </label>

                <div>

                  <img
                    src={preview}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="rounded border object-fit-cover"
                  />

                </div>

              </div>
            )}

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
                value={form.nip}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nip: e.target.value,
                  })
                }
              />

              <div className="invalid-feedback">
                {errors.nip}
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
                  errors.nama
                    ? "is-invalid"
                    : ""
                }`}
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
              />

              <div className="invalid-feedback">
                {errors.nama}
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
                value={form.jabatan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    jabatan:
                      e.target.value,
                  })
                }
              />

              <div className="invalid-feedback">
                {errors.jabatan}
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
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat:
                      e.target.value,
                  })
                }
              />

              <div className="invalid-feedback">
                {errors.alamat}
              </div>

            </div>

            {/* Upload */}
            <div className="mb-3">

              <label className="form-label">
                Foto Baru
              </label>

              <input
                type="file"
                className={`form-control ${
                  errors.foto
                    ? "is-invalid"
                    : ""
                }`}
                accept=".jpg,.jpeg,.png"
                onChange={handleImage}
              />

              <div className="invalid-feedback">
                {errors.foto}
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

            {/* hasil crop */}
            {croppedImage &&
              croppedImage.startsWith(
                "data:image"
              ) && (

              <div className="mb-3">

                <label className="form-label fw-bold">
                  Hasil Crop
                </label>

                <div>

                  <img
                    src={croppedImage}
                    alt="Crop"
                    width={300}
                    height={300}
                    className="rounded border object-fit-cover"
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
                : "Update"}

            </button>

          </form>

        </div>

      </div>

    </Layout>
  );
}