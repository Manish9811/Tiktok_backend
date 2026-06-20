import express from "express";
import cors from "cors";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { saveVideo } from "./models/Video.js";
import { EmptyResultError } from "sequelize";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

let videos = [];

/* UPLOAD VIDEO */
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "video" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const video = {
      id: Date.now(),
      url: result.secure_url,
      public_id : result.public_id
    };

    videos.unshift(video);
    console.log(video)


    try{
      const videoSave = await saveVideo.create({
        videoURL : video.url,
        publicId : video.public_id
      })

      res.json(video);

    }
    catch(err){
      res.status(500).json({ error: err.message });

    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

app.delete("/video/:id", async (req, res) => {
  try {
    const publicId = req.params.id;
    // console.log(videoId)

    // 1. find video in DB
    const video = await saveVideo.findOne({
      where: { publicId: publicId },
    });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // 2. delete from Cloudinary
    await cloudinary.v2.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    // 3. delete from DB (Sequelize way)
    await saveVideo.destroy({
      where: { publicId: publicId },
    });

    res.json({ message: "Video deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* GET VIDEOS */
app.get("/get-videos", async (req, res) => {
  try{
    const videoSave = await saveVideo.findAll();
    console.log(videoSave)
    return res.json(videoSave);

  }
  catch(err){
    res.status(500).json({ error: err.message });

  }
});

app.get('/', (req,res) => {
  return res.json({
    message : "server is running successfully"
  })
})

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});