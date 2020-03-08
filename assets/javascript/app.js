//initialize firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAYSCFZLQJkQypBEHOHA60Nz1cIoAvh8aE",
    authDomain: "train-scheduler-hw7-ec455.firebaseapp.com",
    databaseURL: "https://train-scheduler-hw7-ec455.firebaseio.com",
    projectId: "train-scheduler-hw7-ec455",
    storageBucket: "train-scheduler-hw7-ec455.appspot.com",
    messagingSenderId: "604488762669",
    appId: "1:604488762669:web:1491e04a1e5c6a1fcfbfa4"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//display current time
var currentTimeFormatted = moment().format('LT');
$("#current-time").text("Current Time: " + currentTimeFormatted);


// Button for adding train schedules
$("#add-train").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#input-name").val().trim();
    var destination = $("#input-destination").val().trim();

    var hour =  $("#input-first-time-hour").val().trim();
    var minutes =  $("#input-first-time-minute").val().trim();
    var sHour = hour.toString();
    var sMinutes = minutes.toString();
    var firstTrainTime = (sHour + ":" + sMinutes);
    var frequency = $("#input-frequency").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.firstTrainTime);
    // console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#input-name").val("");
    $("#input-destination").val("");
    $("#input-first-time-hour").val("");
    $("#input-first-time-minute").val("");
    $("#input-frequency").val("");
  });


  // Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination= childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;
  
    // Train Info
    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);


    //calculate next arrival

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format('LT'));
    var nextTrainFormatted = moment(nextTrain).format('LT');
    
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextTrainFormatted),
      $("<td>").text(tMinutesTillTrain),
    );
    // Append the new row to the table
    $("tbody").append(newRow);
  });


//update page every minute with new arrival time and minutes away
//an event would happen at the top of each minute
  //event listener 






// setInterval(checkTime, 5000);

// function checkTime() {

//     var currentTime = moment().format('LT');

//     if (currentTime !== currentTime) {
//         currentTimeFormatted = currentTime;
//         $("#current-time").text("Current Time: " + currentTimeFormatted);
//     }
//     console.log(currentTime);
// }



  


// Bonus (Extra Challenges)
// Consider updating your "minutes to arrival" and "next train time" text once every minute. 
//This is significantly more challenging; only attempt this if you've completed the actual 
//activity and committed it somewhere on GitHub for safekeeping (and maybe create a second GitHub repo).

// Try adding update and remove buttons for each train. Let the user edit the row's 
//elements-- allow them to change a train's Name, Destination and Arrival Time (and then, 
//by relation, minutes to arrival).

// As a final challenge, make it so that only users who log into the site with their Google 
//or GitHub accounts can use your site. You'll need to read up on Firebase authentication 
//for this bonus exercise.