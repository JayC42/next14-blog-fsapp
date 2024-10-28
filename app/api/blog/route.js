import { ConnectDB } from "@/lib/config/db";
import { writeFile } from 'fs/promises';
import BlogModel from '@/lib/models/BlogModel';
const { NextResponse } = require("next/server");
const fs = require('fs');


const LoadDB = async () => {
    try {
      await ConnectDB();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error; // This will propagate the error up
    }
};
  

LoadDB();

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);
    fs.unlink(`./public${blog.image}`,()=>{});
    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({success: true, msg:"Blog Deleted Successfully"});
}


// API Endpoint to get all blogs
export async function GET(request) {
    console.log("Blog GET Hit")
    const blogId = request.nextUrl.searchParams.get("id");

    if (blogId){
       const blog = await BlogModel.findById(blogId);
       return NextResponse.json(blog);
    }
    else
    {
        const blogs = await BlogModel.find({});
        return NextResponse.json({blogs});
    }

}

// API Endpoint for uploading blogs
export async function POST(request) {
    
    try {
        await LoadDB(); // Ensure database is connected

        const formData = await request.formData(); 
        const timestamp = Date.now();

        const image = formData.get('image');
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const path = `./public/${timestamp}_${image.name}`; 

        await writeFile(path, buffer); 
        const imgUrl = `/${timestamp}_${image.name}`;
        const blogData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            author: formData.get('author'),
            image: imgUrl,
            authorImg: formData.get('authorImg'),
        }
        console.log("Attempting to create blog post:", blogData);
        const createdBlog = await BlogModel.create(blogData);
        console.log("Blog created successfully:", createdBlog);

        return NextResponse.json({success: true, msg:"Blog Added Successfully"});

        // await BlogModel.create(blogData);
        // console.log("Blog Added Successfully");
        //return NextResponse.json({success: true, msg:"Blog Added Successfully"});
        } catch (error) {
            console.error("Error in POST /api/blog:", error);
            return NextResponse.json({success: false, msg: "An error occurred while processing your request"}, { status: 500 });
    }
    
    // const formData = await request.formData(); 
    // const timestamp = Date.now();

    // const image = formData.get('image');
    // const imageByteData = await image.arrayBuffer();
    // const buffer = Buffer.from(imageByteData);
    // const path = `./public/${timestamp}_${image.name}`; 

    // await writeFile(path,buffer); 
    // const imgUrl = `/${timestamp}_${image.name}`;
    // const blogData = {
    //     title: `${formData.get('title')}`,
    //     description: `${formData.get('description')}`,
    //     category: `${formData.get('category')}`,
    //     author: `${formData.get('author')}`,
    //     image: `${imgUrl}`,
    //     authorImg: `${formData.get('authorImg')}`,
    // }
    // await BlogModel.create(blogData);
    // console.log("Blog Added Successfully");

    // return NextResponse.json({success: true, msg:"Blog Added Successfully"});
}