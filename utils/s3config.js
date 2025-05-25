const AWS = require('aws-sdk');

AWS.config.update({
  AWS_S3_BUCKET_NAME:process.env.AWS_S3_BUCKET_NAME,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1', // e.g., 'us-east-1'
});

const s3 = new AWS.S3();

module.exports = s3;
