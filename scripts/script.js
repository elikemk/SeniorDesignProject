console.log(faceapi)
console.log(faceapi.version);
const run = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch((err) => {
        console.error('Error accessing media devices:', err);
        alert('Camera and microphone access is required.');
    });
    if (!stream) return;
    
    const video = document.getElementById('camera')
    video.srcObject = stream

    // steps for face api design
    /*
    1. load in the model
    2. trace in canvas
    3. train with reference data. 

    
    * */
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ])


    //setting up the canvas of our video feed 
    const canvas = document.getElementById('canvas')
    canvas.style.left = video.offsetLeft
    canvas.style.top = video.offsetTop
    canvas.height = video.height
    canvas.width = video.width

    //creating two reference faces
    const refFace1 = await faceapi.fetchImage('./elikem.jpg').catch((err) => {
        console.error('Error loading reference face 1:', err);
    });
    const refFace2 = await faceapi.fetchImage('./moretti.jpg').catch((err) => {
        console.error('Error loading reference face 2:', err);
    });
    const refFace3 = await faceapi.fetchImage('./whitley-righteous-walton-c2025.jpg').catch((err) => {
        console.log('Error was loading ref face 3', err);
    });
    if (!refFace1 || !refFace2 || !refFace3) return;
// using dectSinggleFace
    let reFaceAiData1 = await faceapi.detectSingleFace(refFace1).withFaceLandmarks().withFaceDescriptor().withAgeAndGender()
    let reFaceAiData2 = await faceapi.detectSingleFace(refFace2).withFaceLandmarks().withFaceDescriptor().withAgeAndGender()
    let reFaceAiData3 = await faceapi.detectSingleFace(refFace3).withFaceLandmarks().withFaceDescriptor().withAgeAndGender()

    const labeledDescriptors = [new faceapi.LabeledFaceDescriptors("Elikem",[reFaceAiData1.descriptor]), new faceapi.LabeledFaceDescriptors("Moretti", [reFaceAiData2.descriptor]),  new faceapi.LabeledFaceDescriptors("Righteous", [reFaceAiData3.descriptor])]

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)


    setInterval(async()=>{
        //let the face ai data detect faces
        let faceAIData = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();        // draw canvas
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        faceAIData = await faceapi.resizeResults(faceAIData, video)
        faceapi.draw.drawDetections(canvas,faceAIData)
        faceapi.draw.drawFaceLandmarks(canvas,faceAIData)
        faceapi.draw.drawFaceExpressions(canvas,faceAIData)


        faceAIData.forEach(face=> {
            const { age, gender, genderProbability, detection, descriptor } = face
            const genderText = `${gender} - ${Math.round(genderProbability*100)/100*100}`
            const ageText = `${Math.round(age)} years`
            const textField = new faceapi.draw.DrawTextField([genderText, ageText], face.detection.box.topRight)
            
            const bestMatch = faceMatcher.findBestMatch(descriptor);
            const options = {
                label: bestMatch.label !== "unknown" ? bestMatch.toString() : "Unknown Subject"
            };
            const drawBox = new faceapi.draw.DrawBox(detection.box, options);
            drawBox.draw(canvas);

        })

    },200)
    
    

}
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('resources-page');
    if (button) {
        button.addEventListener('click', () => {
            console.log('Redirecting...');
            window.location.href = 'resources.html';
        });
    } else {
        console.error('Element with ID "resource-page" not found.');
    }
    const button2 = document.getElementById('about-page');
    if (button2) {
        button2.addEventListener('click', () => {
            console.log('Redirecting...');
            window.location.href = 'about.html';
        });
    } else {
        console.error('Element with ID "resource-page" not found.');
    }
});


run()







