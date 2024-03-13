import * as AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  s3ForcePathStyle: true,
});

export function upload(file, filename, mimetype) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: filename,
    ContentType: mimetype,
    Body: file,
    ACL: 'public-read',
    Metadata: {},
  };
  return new Promise((resolve, reject) => {
    const request = s3.putObject(params);
    request.on('httpHeaders', (statusCode, headers) => {
      if (statusCode !== 200) {
        return reject(`Failed to upload ${filename} with status code: ${statusCode}`);
      }
      const cid = headers['x-amz-meta-cid'];
      return resolve(`https://ipfs.filebase.io/ipfs/${cid}`);
    });
    request.send();
  });
}
