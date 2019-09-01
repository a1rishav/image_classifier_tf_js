let net;
const webcamElement = document.getElementById('webcam');

function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

async function video_app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();
  while (true) {
    const result = await net.classify(webcamElement);

    document.getElementById('video').innerText = `
      Prediction: ${result[0].className}\n
      Probability: ${result[0].probability.toFixed(2) * 100 + " %"}
    `;

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
}
video_app();


async function image_app() {
  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  // Make a prediction through the model on our image.
  display_prediction()
}

async function display_prediction(){
  const imgEl = document.getElementById('img');
  net = await mobilenet.load();
  const result = await net.classify(imgEl);
  console.log(result);
  document.getElementById('image_prediciton').innerText = `
      Prediction: ${result[0].className}\n
      Probability: ${result[0].probability.toFixed(2) * 100 + " %"}
    `;
}

image_app();

 function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#img').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
        display_prediction()
    }

    $("#imgInp").change(function(){
        readURL(this);
    });