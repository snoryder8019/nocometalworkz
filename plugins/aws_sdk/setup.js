import AWS from 'aws-sdk';
import fs from 'fs/promises';

// Configure AWS SDK for Linode Object Storage
const s3 = new AWS.S3({
  accessKeyId: process.env.LINODE_ACCESS,
  secretAccessKey: process.env.LINODE_SEC,
  endpoint: process.env.LINODE_URL,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: process.env.LINODE_REGION,
  httpOptions: {
    connectTimeout: 10000, // 10 seconds
    timeout: 30000, // 30 seconds
  },
});

/**
 * Uploads a file or buffer to Linode Object Storage and optionally deletes an old file.
 * @param {Buffer|string} input - A Buffer if the file is in memory or a string path if the file is on disk.
 * @param {String} newFileKey - Key under which to store the file in the bucket (new unique file name).
 * @param {String} [oldFileKey] - (Optional) Key of the old file to delete after the new one is uploaded.
 * @returns {Promise<String>} URL of the uploaded file.
 */
export const uploadToLinode = async (input, newFileKey, oldFileKey = null) => {
  // Validate environment variables
  if (!process.env.LINODE_BUCKET) {
    throw new Error('LINODE_BUCKET environment variable is not set.');
  }

  let fileContent;

  if (Buffer.isBuffer(input)) {
    // If input is a buffer, use it directly
    fileContent = input;
  } else if (typeof input === 'string') {
    // If input is a string, assume it's a file path and read the file asynchronously
    try {
      fileContent = await fs.readFile(input);
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  } else {
    throw new TypeError('Input must be a Buffer or a file path string.');
  }

  const params = {
    Bucket: process.env.LINODE_BUCKET,
    Key: newFileKey,
    Body: fileContent,
    ACL: 'public-read', // Adjust according to your privacy requirements
    ContentType: 'application/octet-stream', // Optional: set correct Content-Type based on file
  };

  try {
    // Upload the new file to Linode
    const uploadResult = await s3.upload(params).promise();
    console.log(`Uploaded file to Linode: ${uploadResult.Location}`);

    // If an old file key is provided, delete the old file
    if (oldFileKey) {
      console.log(`Deleting old file: ${oldFileKey}`);
      await s3.deleteObject({
        Bucket: process.env.LINODE_BUCKET,
        Key: oldFileKey,
      }).promise();
      console.log(`Old file deleted: ${oldFileKey}`);
    }

    return uploadResult.Location; // URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to Linode Object Storage:', error);
    throw error; // Rethrow to handle it in the calling function
  }
};
/**
 * Fetches all object URLs from the Linode Object Storage bucket.
 * @returns {Promise<String[]>} Array of URLs for all objects in the bucket.
 */

export const fetchGalleryImages= async()=> {
  const params = {
    Bucket: 'scottslab', // Replace with your bucket name
    Prefix: 'nocometalworkz/gallery/', // Path to the directory
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    // Filter and map objects to return only image URLs
    const images = data.Contents.map((item) => {
      return `${process.env.LINODE_URL}/scottslab/${item.Key}`;
    });

    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
}
