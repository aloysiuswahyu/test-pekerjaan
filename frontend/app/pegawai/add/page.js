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

const schema = yup.object({

  nip: yup
    .string()
    .required(
      "NIP wajib diisi"
    ),

  nama: yup
    .string()
    .required(
      "Nama wajib diisi"
    ),

  jabatan: yup
    .string()
    .required(
      "Jabatan wajib diisi"
    ),

  alamat: yup
    .string()
    .required(
      "Alamat wajib diisi"
    ),

  image: yup
    .mixed()

    // optional
    .nullable()

    // validate type
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

    // validate size
    .test(
      "fileSize",
      "Ukuran gambar maksimal 2MB",
      (value) => {

        if (!value) return true;

        return (
          value.size <=
          2 * 1024 * 1024
        );
      }
    ),

});



export default function AddPegawaiPage() {

  const router = useRouter();
  const cropperRef = useRef(null);
  const [image, setImage] =  useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [isCropped, setIsCropped] = useState(false);

  const [imageError, setImageError] = useState(""); 
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const [form, setForm] =
    useState({
      nip: "",
      nama: "",
      jabatan: "",
      alamat: "",
    });

  // upload image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;
    setImageError("");

    // validate image 
    const allowedTypes = [ "image/jpeg", "image/jpg", "image/png", ]; 
    if ( !allowedTypes.includes( file.type ) ) { 
      setImageError( "Format gambar harus JPG / PNG" );
       return; 
    } 
    // max 2mb 
    if ( file.size > 2 * 1024 * 1024 ) {
       setImageError( "Ukuran gambar maksimal 2MB" ); 
       return; 
    }

    const reader = new FileReader();

    reader.onload = () => {

      setImage(
        reader.result
      );

      setCroppedImage(null);

      setIsCropped(false);
    };

    reader.readAsDataURL(file);
  };

  // crop image
  const handleCrop = async () => {

    if ( cropperRef.current?.cropper ) {

      const canvas =
        cropperRef.current
          .cropper
          .getCroppedCanvas({
            width: 300,
            height: 300,
            imageSmoothingQuality: "high",
          });

      if (canvas) {

        const cropped = canvas.toDataURL("image/jpeg", 0.9);
        setCroppedImage(  cropped );
        setIsCropped(true);
      }
    }
  };

  // reset crop
  const resetCrop = () => {

    setCroppedImage(null);

    setIsCropped(false);
  };

  // submit
  const submit = async (e) => {

    // e.preventDefault();
    // validasi crop 
    if ( image && !croppedImage ) { 
      setImageError( "Silakan crop gambar terlebih dahulu" ); 
      return;
    }

    setLoading(true);

    try {

      const data = new FormData();

      data.append( "nip", form.nip );
      data.append( "nama", form.nama );
      data.append("jabatan", form.jabatan);
      data.append( "alamat",form.alamat);

      // upload hasil crop
      if (croppedImage) {

        const blob = await fetch( croppedImage ).then((r) => r.blob());

        data.append(
          "foto",
          blob,
          "foto.jpg"
        );
      }

      await api.post( "/employee/create", data );

      router.push(  "/pegawai" );

    } catch (err) {

      console.log(err);

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
          onSubmit={submit}
        >

          {/* NIP */}
          <div className="mb-3">

            <label className="form-label">
              NIP
            </label>

            <input
              type="text"
              className="form-control"
              value={form.nip}
              onChange={(e) =>
                setForm({
                  ...form,
                  nip: e.target.value,
                })
              }
            />

          </div>

          {/* Nama */}
          <div className="mb-3">

            <label className="form-label">
              Nama
            </label>

            <input
              type="text"
              className="form-control"
              value={form.nama}
              onChange={(e) =>
                setForm({
                  ...form,
                  nama: e.target.value,
                })
              }
            />

          </div>

          {/* Jabatan */}
          <div className="mb-3">

            <label className="form-label">
              Jabatan
            </label>

            <input
              type="text"
              className="form-control"
              value={form.jabatan}
              onChange={(e) =>
                setForm({
                  ...form,
                  jabatan: e.target.value,
                })
              }
            />

          </div>

          {/* Alamat */}
          <div className="mb-3">

            <label className="form-label">
              Alamat
            </label>

            <textarea
              rows="3"
              className="form-control"
              value={form.alamat}
              onChange={(e) =>
                setForm({
                  ...form,
                  alamat: e.target.value,
                })
              }
            />

          </div>

          {/* Upload */}
          <div className="mb-3">

            <label className="form-label">
              Foto
            </label>

            <input
              type="file"
              className="form-control"
              accept=".jpg,.jpeg,.png"
              onChange={handleImage}
            />
            <div className="invalid-feedback"> {imageError} </div>

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

                cropBoxResizable={
                  false
                }

                cropBoxMovable={
                  false
                }

                background={false}

                responsive={true}

                autoCropArea={1}

                checkOrientation={
                  false
                }

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