console.log(faceapi)

const run = async()=>{
    

    // voice commands
$("#startVoiceCommand").click(function () {
    console.log("Voice started!");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition; // used for compantiblites issues

    if (!SpeechRecognition) {
      alert("Your browser doesn't support this feature.");
      return; // function returns alert if browser doesn't support command
    }

    const recognition = new SpeechRecognition(); // create a new 
    recognition.continuous = false; // one single command input

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim(); // transcript command sourced
      console.log("Respone: " + command);

      $("#voiceOut").text("Response: " + command); //command 

      if (command.includes("go to one")) {
        $("#daze")[0].click();
      } else if (command.includes ("go to two")) {
        $("#nueralmedia")[0].click();
      } else if (command.includes ("go to three")) {
        $("#a-thought")[0].click();
      }
      else if (command.includes ("go to four")) {
        $("#wow")[0].click();
      } else {
        alert(" Try saying: Go to [1,2,3, or 4]");
      }
    };

    recognition.onerror = (event) => {
      console.error("Voice error: " + event.error);
      alert("Failed To load! Wait 20 Seconds to Try Again");
    };

    recognition.start(); //then listen for commands
    // source: debuging helped by in class and W3Schools
  });
    

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("home-page");
    if (button) {
      button.addEventListener("click", () => {
        console.log("Redirecting...");
        window.location.href = "index.html";
      });
    } else {
      console.error('Element with ID "home-page" not found.');
    }
    const button1 = document.getElementById("resources-page");
    if (button1) {
      button1.addEventListener("click", () => {
        console.log("Redirecting...");
        window.location.href = "resources.html";
      });
    } else {
      console.error('Element with ID "home-page" not found.');
    }
  })

}



run()


