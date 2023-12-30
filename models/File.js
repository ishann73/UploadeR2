const mongoose = require("mongoose");
const nodemailer=require("nodemailer");


const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});
  fileSchema.post("save",async function(doc){
    try{
      console.log("DOC",doc);
      let transport=nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
      });
      let info=await transport.sendMail({
        from:`UploadeR- Media Management Service`,
        to:doc.email,
        subject:"New file Uploaded on Cloudinary",
        html:`<h2>Hello Pal</h2> <p>file uploaded</p> View Here <a href="${doc.imageUrl}">${doc.imageUrl}</a>`,

      })
      console.log(info);
    }
    catch(error){
    console.error(error);
    }
  })

const File = mongoose.model("File", fileSchema);
module.exports = File;