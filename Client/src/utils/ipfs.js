import axios from "axios";

// Pinata credentials
const PINATA_API_KEY = "b5023885c6948426d272";
const PINATA_SECRET_API_KEY = "3f856c1e3405f9d29d5d4391dba2acbd637f8ac457ff0524f7a97f060b97b16f";

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    console.log("✅ IPFS File Hash:", res.data.IpfsHash);
    return res.data.IpfsHash;
  } catch (err) {
    console.error("❌ IPFS Upload Error:", err);
    throw err;
  }
};
