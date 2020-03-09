//this version is the app functioning with minimum requirements: 
    //create a train schedule application that incorporates Firebase to host arrival and departure data.
  //Your app will retrieve and manipulate this information with Moment.js
  //This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station

// Make sure that your app suits this basic spec:
  // When adding trains, administrators should be able to submit the following:
      // Train Name
      // Destination
      // First Train Time -- in military time
      // Frequency -- in minutes
  // Code this app to calculate when the next train will arrive; this should be relative to the current time.
  // Users from many different machines must be able to view same train times.
  // Styling and theme are completely up to you. Get Creative!


// Plus the following bonus tasks:
    // 1. includes the local current time displayed on the train timetable
    // 2. updates the timetable "minutes to arrival" and "next train time" text once every minute. 


// next iteration to do:
    // put current time into a div and display in same header as "Current Train Schedule"
    // allow user to "remove" train schedule with "x" button


$(document).ready(function () {

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


//display current time initially
var currentTimeFormatted = moment().format('LT');
$("#current-time").text("Current Time: " + currentTimeFormatted);

//every 5 seconds, the current time is checked 
//if it has changed, the current time on the page is updated
setInterval(updateCurrentTime, 5000);

//display database initially
updateTimetable();


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
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      currentTimeFormatted: currentTimeFormatted
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    alert("Train schedule successfully added");  
  
    // Clears all of the text-boxes
    $("#input-name").val("");
    $("#input-destination").val("");
    $("#input-first-time-hour").val("");
    $("#input-first-time-minute").val("");
    $("#input-frequency").val("");

    updateTimetable();
  });

/////////// Functions //////////////////////

//updating time and timetable every 5 seconds
function updateCurrentTime() {

    var newCurrentTimeFormatted = moment().format('LT');
    $("#current-time").text("Current Time: " + newCurrentTimeFormatted);
    
    if (currentTimeFormatted !== newCurrentTimeFormatted) {
        currentTimeFormatted = newCurrentTimeFormatted;
        updateTimetable();
    }
}

//run inside updateTimeTable function to clear rows in timetable before re-rendering them
function DeleteRows() {
    var rowCount = currentSchedule.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        currentSchedule.deleteRow(i);
    }
}

//to update timetable every minute or when new train schedules are added
function updateTimetable() {

    DeleteRows();


    database.ref().on("child_added", function(childSnapshot) {
    
        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var destination= childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;
        var frequency = childSnapshot.val().frequency;
  
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var nextTrainFormatted = moment(nextTrain).format('LT');
    
        // Create the new row
        var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td id='next-train'>").text(nextTrainFormatted),
        $("<td id='minutes-away'>").text(tMinutesTillTrain),
        );

        // Append the new row to the table
        $("tbody").append(newRow);
    });
}

});



// Bonus (Extra Challenges)

// Try adding update and remove buttons for each train. Let the user edit the row's 
//elements-- allow them to change a train's Name, Destination and Arrival Time (and then, 
//by relation, minutes to arrival).

// As a final challenge, make it so that only users who log into the site with their Google 
//or GitHub accounts can use your site. You'll need to read up on Firebase authentication 
//for this bonus exercise.