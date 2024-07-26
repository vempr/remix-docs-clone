import uploadImageToCloudinary from "~/services/cloudinary.server.ts";

import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  UploadHandler,
} from "@remix-run/node";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
  async ({ name, data, contentType }) => {
    if (name !== "profilePicture") {
      return undefined;
    } else {
      if (!contentType.startsWith("image"))
        throw new Error("File must be of image type.");

      const chunks = [];
      let totalSize = 0;

      for await (const chunk of data) {
        chunks.push(chunk);
        totalSize += chunk.length;
        if (totalSize > MAX_FILE_SIZE) {
          throw new Error("File size exceeds 5MB limit");
        }
      }

      const buffer = Buffer.concat(chunks);
      const uploadedImage = await uploadImageToCloudinary(buffer);
      return uploadedImage.public_id;
    }
  },
  unstable_createMemoryUploadHandler(),
);

export default uploadHandler;
