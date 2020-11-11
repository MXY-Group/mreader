import { Model, DataTypes } from "../../deps.ts";

class Manga extends Model {
    static table = "mangas";

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.string(255),
        status: DataTypes.string(255),
        totalchapters: DataTypes.INTEGER,
        chapters: DataTypes.INTEGER
    };
}

export default Manga;