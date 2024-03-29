const Listing=require("../models/listing");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index=async (req,res)=>{
    let allListing=await Listing.find();
    res.render("listing/index.ejs",{allListing});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs")
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate( {path:"reviews",populate:{path:"author",}}).populate("owner");
    if(! listing){
        req.flash("error","Listing you requested doesn't Exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{

    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
    }).send();

    

    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;

    let saved=await newListing.save();
    console.log(saved);
    req.flash("success","New Listing Created !");
    res.redirect("/Listings");  
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings){
        req.flash("error","Listing you requested doesn't Exist!")
        res.redirect("/listings")
    }
   let blurImg= listings.image.url;
   blurImg=listings.image.url.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs",{listings,blurImg});
};

module.exports.updateListing=async (req,res)=>{
    
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
}
    req.flash("success","Listing updated Sucessfully");
    res.redirect(`/Listings/${id}`);
   
};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !")
    res.redirect("/Listings");
};