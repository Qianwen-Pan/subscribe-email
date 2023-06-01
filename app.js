const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
    apiKey: "64ff1de3cf45cfd26a1483d2ebf0a3ab-us21",
    server: "us21",
  });
  

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;

    const run = async () => {
        try {
            const response = await client.lists.batchListMembers("8e1495ec86", {
                members: [{
                  "email_address" :email,
                  "status": "subscribed",
                  "merge_fields": {
                  "FNAME": fName,
                  "LNAME": lName
                          }
                      }],
                  });
      
            
              res.sendFile(__dirname + "/success.html");
            //   console.log(`newmember: ${response.body.new_members})`);
            console.log(response.new_members);
            console.log(response.errors);
        } catch (error) {
            // console.log(`Status: ${error.status}`);
            // console.log(`Response: ${JSON.stringify(error.response.detail)}`);
            console.log(error.status);
            console.log(error.text);
            console.log(error.method);
            res.sendFile(__dirname + "/failure.html");
        }
        
      };
      
    run();
    
});

app.post("/faliure", (req, res) => {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});


//64ff1de3cf45cfd26a1483d2ebf0a3ab-us21  api key
//list id 8e1495ec86