const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'dark-mode.png');
const outputPath = path.join(__dirname, 'src', 'app', 'icon.png');
const avatarPath = path.join(__dirname, 'public', 'avatar.png');

sharp(inputPath)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(outputPath)
  .then(() => {
    console.log('Successfully resized icon.png for Next.js build');
    return sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(avatarPath);
  })
  .then(() => {
    console.log('Successfully created avatar.png for Vercel Dashboard');
  })
  .catch(err => {
    console.error('Error resizing image:', err);
  });
