const File = require("../models/File");
const cloudinary=require("cloudinary").v2;

//localfileupload -> handler function

exports.localFileUpload = async (req, res) => {
    try {

        //fetch filefrom request
        const file = req.files.file;
        console.log("FILE received -> ",file);


        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH-> ", path)

        //add path to the move fucntion
        file.mv(path , (err) => {
            console.log(err);
        });

        //create a successful response
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });

    }
    catch(error) {
        console.log("Not able to upload the file on server")
        console.log(error);
    }
}
   
  
  function isFileTypeSupported(fileType,supportedTypes){
    return supportedTypes.includes(fileType);
  }

  async function uploadFileToCloudinary(file,folder, quality){
    const options={folder};
    if(quality)
    {
        options.quality=quality;
    }
    // options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
  }
  
exports.imageUpload= async(req,res) => {
   try{
     const{name,tags,email}=req.body;

     console.log(name,tags,email);

     const file= req.files.imageFile;
     console.log(file);

     const supportedTypes=["jpg","jpeg","png"];
     const fileType= file.name.split('.')[1].toLowerCase();

     if(!isFileTypeSupported(fileType,supportedTypes)){
       return res.status(400).json({
        success:false,
        message:'File format not supported',
       })
     }
     const response=await uploadFileToCloudinary(file,"OrganizedRepo");

     const fileData=await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
     });

     res.json({
        success:true,
        imageUrl:response.secure_url,
        message:'Image uploaded successfully',
     })
   }catch(error){
    console.error(error);
    res.status(400).json({
        success:false,
        message:"Something went wrong",
    });
   }
}


exports.videoUpload= async (req,res) => {
   try{
    const{name,tags,email}=req.body;
    console.log(name,tags,email);

    const file=req.files.videoFiles;

    
    const supportedTypes=["mp4","mov"];
    const fileType= file.name.split('.')[1].toLowerCase();

    if(!isFileTypeSupported(fileType,supportedTypes)){
        return res.status(400).json({
         success:false,
         message:'File format not supported',
        })
      }

      const response=await uploadFileToCloudinary(file,"OrganizedRepo");
  
      const fileData=await File.create({
        name,
        tags,
        email,
        imageUrl:response.secure_url,
     });

     res.json({
        success:true,
        imageUrl:response.secure_url,
        message:'Image uploaded successfully',
     })

   }catch(error){
    console.error(error);
    res.status(400).json({
        success:false,
        message:'Something went wrong',
    })
   }
}

exports.imageSizeReducer= async (req,res)=>{
    try{
        const{name,tags,email}=req.body;

        console.log(name,tags,email);
   
        const file= req.files.imageFile;
        console.log(file);
   
        const supportedTypes=["jpg","jpeg","png"];
        const fileType= file.name.split('.')[1].toLowerCase();
   
        if(!isFileTypeSupported(fileType,supportedTypes)){
          return res.status(400).json({
           success:false,
           message:'File format not supported',
          })
        }
        const response=await uploadFileToCloudinary(file,"OrganizedRepo",30);
   
        const fileData=await File.create({
           name,
           tags,
           email,
           imageUrl:response.secure_url,
        });
   
        res.json({
           success:true,
           imageUrl:response.secure_url,
           message:'Image uploaded successfully',
        })
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}