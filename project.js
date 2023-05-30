var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AccessKeyId',
    secretAccessKey: 'SecretAccesskey',
    region: 'ap-northeast-2'
});

var params = {
    Image: {
        S3Object: {
            Bucket: "testingrekognition2714",
            Name: "사진.jpg"
        }
    },
    MaxLabels: 5,
MinConfidence: 80
};

const rekognition = new AWS.Rekognition();
rekognition.detectLabels(params, function(err, data){
    if (err) console.log(err, err.stack);
    else     console.log(data);
});
