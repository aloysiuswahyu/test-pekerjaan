import api, { setAccessToken } from "./api";

export const refreshToken = async () => {

  try {

    const res = await api.post('/refresh');

    setAccessToken(res.data.access_token);

    return res.data.access_token;

  } catch (err) {

    return null;

  }
};