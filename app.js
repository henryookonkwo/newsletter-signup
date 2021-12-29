//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = 3000;

app.use(express.static("public")); //Created a static folder to allow us to access the static pages on our local device
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
     apiKey: "ae4c52af8ee1303cb7461da7475a764b-us20",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
     server: "us20"
    });


app.get("/", (req,res) => {
    res.sendFile(__dirname+ "/signup.html");
    // res.send("Server is up and running.");
});


//As soon as the sign in button is pressed execute this
app.post("/", (req,res) =>{
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email ;

    console.log(firstName + " " + lastName + " " + email);
    // res.send("Post request received");
      
//*****************************ENTER YOU LIST ID HERE******************************
 const listId = "3fa183d1c0";
//Creating an object with the users data
const subscribingUser = {
 firstName: firstName,
 lastName: lastName,
 email: email
};
//Uploading the data to the server
 async function run() {
const response = await mailchimp.lists.addListMember(listId, {
 email_address: subscribingUser.email,
 status: "subscribed",
 merge_fields: {
 FNAME: subscribingUser.firstName,
 LNAME: subscribingUser.lastName
}
});
//If all goes well logging the contact's id
 res.sendFile(__dirname + "/success.html")
//  console.log("Successfully added contact as an audience member. The contact's id is " + response.id +".");
console.log(response);
}

//Running the function and catching the errors (if any)
// So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
 run().catch(e => res.sendFile(__dirname + "/failure.html"));
   
});

app.post("/failure", (req,res) =>{
    res.redirect("/");
});

//Added "process.env.PORT" dynamic port for Heroku
app.listen(process.env.PORT || port, () => {
    console.log("Server is running on port " + port);
});



 