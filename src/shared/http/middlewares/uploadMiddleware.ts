import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "../../../config/environment";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "siob-ocorrencias",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
      public_id: `oc_${Date.now()}_${file.originalname.split('.')[0]}`, 
    };
  },
});

export const uploadMiddleware = multer({ storage: storage });