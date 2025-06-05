import axios from "axios";

const BACKEND_UPLOAD_URL = "http://localhost:4000/upload"; // Change if deployed

export async function uploadFileToPinata(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(BACKEND_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.ipfsHash;
  } catch (error) {
    console.error("Backend upload error:", error);
    throw error;
  }
}
