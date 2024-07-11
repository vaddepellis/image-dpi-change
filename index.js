const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { promisify } = require('util');
const sharp = require('sharp');
const cors= require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.get('/',(req,res)=>{
res.status(200).json({msg:'success'})
})
// Endpoint to receive base64 image
app.post('/upload', async (req, res) => {
  // Input base64 image string
const inputBase64Image = req.body.image; // Your base64 image string here

// Desired DPI
const desiredDpi = 300;

// Decode the base64 image
const base64Data = inputBase64Image.split(';base64,').pop();
const inputBuffer = Buffer.from(base64Data, 'base64');

sharp(inputBuffer)
  .withMetadata({ density: desiredDpi })
  .toBuffer()
  .then(outputBuffer => {
    // Convert the processed image buffer to base64
    const outputBase64Image = `data:image/jpeg;base64,${outputBuffer.toString('base64')}`;
    console.log('Output base64 image:', outputBase64Image);
  })
  .catch(err => {
    console.error('Error processing image:', err);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
