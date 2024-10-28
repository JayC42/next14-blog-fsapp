import mongoose from "mongoose"

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://Jc650:hVC68CW0SUVliUPR@cluster0.xeoys.mongodb.net/blog-app');
    console.log('Database connected successfully');
}