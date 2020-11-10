import { Model, DataTypes } from "../../deps.ts";

export const Chapter = class Chapter extends Model {
    static table = "chapters";

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.string(255),
        uploader: DataTypes.INTEGER,
        manga: DataTypes.INTEGER
    };

    id!: number;
    title!: string;
    uploader!: number;
    manga!: number;
}