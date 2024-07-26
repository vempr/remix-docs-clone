import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function uploadImageToCloudinary(data: Buffer) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "remix",
        },
        (error, result) => {
          console.log(error, result);
          if (error) {
            reject(error);
            return;
          }
          resolve(result as UploadApiResponse);
        },
      );
      let stream = Readable.from(data);
      stream.pipe(uploadStream);
    },
  );

  return uploadPromise;
}
