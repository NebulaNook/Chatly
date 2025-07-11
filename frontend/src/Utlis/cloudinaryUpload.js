export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "your_preset_name"); // replace with your preset
  data.append("cloud_name", "your_cloud_name");

  const res = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/upload`, {
    method: "POST",
    body: data,
  });

  const json = await res.json();
  return json.secure_url;
};
