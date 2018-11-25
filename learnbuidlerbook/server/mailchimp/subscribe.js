import request from "request";

require("dotenv").config();

export default async function subscribe({ email }) {
  const data = {
    email_address: email,
    status: "subscribed"
  };

  const LIST_ID = process.env.MAILCHIMP_PURCHASED_LIST_ID;
  const REGION = process.env.MAILCHIMP_REGION;
  const API_KEY = process.env.MAILCHIMP_API_KEY;

  const uri = `https://${REGION}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`;
  const authorizationString = `Basic ${Buffer.from(
    `apikey:${API_KEY}`
  ).toString("base64")}`;

  await new Promise((resolve, reject) => {
    request(
      {
        uri,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: authorizationString
        },
        json: true,
        body: data
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      }
    );
  });
}
