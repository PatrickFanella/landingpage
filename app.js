//!API KEY
//*'d806d0644c876829b1a614008acf75e7-us20';
//!LIST ID
//*23e010bced

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
require('dotenv').config();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

mailchimp.setConfig({
  apiKey: 'd806d0644c876829b1a614008acf75e7-us20',
  server: 'us20',
});

app.post('/', (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const listId = '23e010bced';
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    res.sendFile(__dirname + '/success.html');
  }

  run().catch(e => {
    console.log(e);
    res.sendFile(__dirname + '/failure.html');
  });
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
