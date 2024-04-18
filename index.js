const axios = require('axios');
const async = require('async');

const API_URL = 'http://api.com';
const REQUESTS_PER_SECOND = 5; // Number of requests per second
const TOTAL_REQUESTS = 1; // Total number of requests to make
const BURST_SIZE = 10; // Number of requests in each burst

  const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "traceparent": "00-0b14fcc825f4aa6b3a6f3972cb367724-c1ff8d653ea434ce-01",
    "Referer": "https://referer.com/"
  };


const makeRequest = async () => {
    let t2 = 0;
    let t1 = new Date().getTime();
    try {
      const response = await axios.post(API_URL, {
        "to": "test@test.com",
        "from_name": "test channel",
        "from_email": "from@test.com",
        "reply_to_email": "from@test.com",
        "cc": [],
        "bcc": [],
        "subject": "test cpass",
        "body": "test email body"
    }, {
        headers: headers
      });
      t2 = new Date().getTime();
      console.log('> Response:', response.data, ' Time: ', t2 - t1);
    } catch (error) {
      console.error('> Response header:', error.response.headers.toJSON(), 'Error:', error.message);
    }
  };
  
  // Function to make burst requests
  const makeBurstRequests = () => {
    const tasks = Array.from({ length: BURST_SIZE }, () => makeRequest);
    async.parallel(tasks, (error, results) => {
      if (error) {
        console.error('Error making burst requests:', error);
      }
    });
  };
  
// Function to initiate requests at the specified rate
const initiateRequests = () => {
    let count = 0;
    const intervalId = setInterval(() => {
      count += 1;
      makeBurstRequests();
      if (count >= TOTAL_REQUESTS) {
        clearInterval(intervalId);
      }
    }, 1000 / REQUESTS_PER_SECOND);
  };
  
  // Start making requests
//   initiateRequests();
  setTimeout(initiateRequests, 500);