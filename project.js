var AWS = require('aws-sdk');
const { createCanvas, loadImage, registerFont } = require('canvas');

AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'ap-northeast-2'
});


var params = {
  Image: {
    S3Object: {
      Bucket: "testingrekognition2714",
      Name: "사진2.jpg"
    }
  },
  MaxLabels: 5,
  MinConfidence: 80,
};

// Call AWS Rekognition Class
const rekognition = new AWS.Rekognition();

// Detect labels
rekognition.detectLabels(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
  } else {
    console.log(data); // successful response
    const labels = data.Labels; // Assign the detected labels to the 'labels' array

    // Load Arial font
    registerFont('arialCE.ttf', { family: 'Sans' });

    // Create a canvas
    const canvas = createCanvas();
    const context = canvas.getContext('2d');

    // Load and draw the image
    loadImage('./사진2.jpg').then((image) => {
      // Get the original image dimensions
      const imageWidth = image.width;
      const imageHeight = image.height;

      // Resize the canvas to match the original image size
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      context.drawImage(image, 0, 0);

      // Set font properties
      const fontSize = 20;
      const fontFamily = 'ArialCE';
      context.font = `${fontSize}px ${fontFamily}`;

      // Draw circles and rectangles around objects
      labels.forEach((label) => {
        const name = label.Name;
        label.Instances.forEach((instance, index) => {
          if (instance.BoundingBox && instance.BoundingBox.Left) {
            const { Left, Top, Width, Height } = instance.BoundingBox;

            // Calculate the bounding box coordinates relative to the original image size
            const x = Left * imageWidth;
            const y = Top * imageHeight;
            const width = Width * imageWidth;
            const height = Height * imageHeight;

            // Draw the shape based on the object's index
            if (index === 0) {
              // Draw a circle
              const centerX = x + width / 2;
              const centerY = y + height / 2;
              const radius = Math.max(width, height) / 2;

              context.beginPath();
              context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
              context.lineWidth = 5;
              context.strokeStyle = 'blue';
              context.fillStyle = 'transparent';
              context.stroke();
            }

            // Draw a rectangle
            context.beginPath();
            context.rect(x, y, width, height);
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.fillStyle = 'transparent';
            context.stroke();
          }
        }); // 추가된 괄호
      }); // 추가된 괄호
    });
  }
});
