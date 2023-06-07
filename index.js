require('dotenv').config()

//instagram api
const {IgApiClient}=require('instagram-private-api')
const { get } =require('request-promise') 

//scheduler
const CronJob=require("cron").CronJob;


//app server
const express=require("express");
const app=express()
const port = process.env.PORT || 4000;

const axios=require('axios')


let imageUrl;
let imageCaption;

app.use(express.json())
app.use("/",(req,res) =>{
    console.log("Backend")
    res.send("Backend");
})
app.listen(port,()=> {
    console.log(`Listening to port ${port}`)
})



const postImage=async()=>{
    try{
        console.log("inside posting")
        const ig= new IgApiClient();
        ig.state.generateDevice(process.env.IG_USERNAME);
        await ig.account.login(process.env.IG_USERNAME,process.env.IG_PASSWORD)

    

        //uploading
        const imageBuffer= await get({
            url : imageUrl,
            encoding: null,
        })
        await ig.publish.photo(
            {
                file : imageBuffer,
                caption : imageCaption
            }
        );
        console.log("posted")
    }catch(err){
        fetchImage2();
        postImage();
        console.log(err);
    }
}

const cronInsta = new CronJob("0 10 * * *", async () => {
    await fetchImage();
    await postImage();
});

cronInsta.start();

const fetchImage=async()=>{
    let url=`https://api.unsplash.com/photos/random/?query=nature&client_id=${process.env.CLIENT_ID}`
    try{
        const res=await axios.get(url)
        console.log(res.data.urls.regular);
        imageUrl=res.data.urls.regular
        console.log(res.data.tags[5].source.cover_photo.description)
        imageCaption=res.data.tags[5].source.cover_photo.description
    }
    catch(err){
        fetchImage2();
        console.log(err);
    }
    
    
}

const fetchImage2=async()=>{
    let url=`https://api.unsplash.com/photos/random/?query=nature&client_id=${process.env.CLIENT_ID}`
    try{
        const res=await axios.get(url)
        console.log(res.data.urls.regular);
        imageUrl=res.data.urls.regular
        console.log(res.data.tags[5].source.cover_photo.description)
        imageCaption=res.data.tags[5].source.cover_photo.description
    }
    catch(err){
        imageUrl="https://img.freepik.com/free-photo/assortment-with-happy-emotion_23-2148860256.jpg"
        imageCaption="Be happy"
        console.log(imageUrl);
        console.log(imageCaption)
        
    }
}
    


