import { DataTypes } from "sequelize";
import sequelize from '../config/db.js'
export const saveVideo = sequelize.define("saved_videos", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    videoURL: DataTypes.STRING,
    publicId: DataTypes.STRING,
    createdAt : DataTypes.DATE,
    updatedAt : DataTypes.DATE
})
