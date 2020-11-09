import { Model, DataTypes } from "../../deps.ts";

export const User = class User extends Model {
    static table = "users";

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.string(255),
        password: DataTypes.string(2555),
        email: DataTypes.string(255),
        joined: DataTypes.TIMESTAMP
    };

    id!: number;
    username!: string;
    password!: string;
    email!: string;
}