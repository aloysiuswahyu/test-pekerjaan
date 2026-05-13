import { toast } from "react-toastify";

export const handleApiError = (
  err,
  setError,
  defaultMessage = "Terjadi kesalahan"
) => {

  // validation API
  if (
    err.response &&
    err.response.status === 422
  ) {

    const errors =
      err.response.data.messages;

    Object.keys(errors).forEach((field) => {

      setError(field, {
        type: "server",
        message: errors[field],
      });

    });

    toast.error("Validation error");

    return;
  }

  // unauthorized
  if (
    err.response &&
    err.response.status === 401
  ) {

    toast.error("Session expired");

    return;
  }

  // forbidden
  if (
    err.response &&
    err.response.status === 403
  ) {

    toast.error("Access denied");

    return;
  }

  // server error
  if (
    err.response &&
    err.response.status === 500
  ) {

    toast.error("Internal server error");

    return;
  }

  toast.error(defaultMessage);
};