
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

    //display database initially on load of page, this displays any data sets already in the database
    updateTimetable();

    // Button for adding train schedules
    $("#add-train").on("click", function (event) {
        event.preventDefault();

        trainNameInput = $("#input-name").val();
        destinationInput = $("#input-destination").val();
        hourInput = $("#input-first-time-hour").val();
        minutesInput = $("#input-first-time-minute").val();
        frequencyInput = $("#input-frequency").val();

        //only allows entry if there is something in each field  
        if (trainNameInput && destinationInput && hourInput && minutesInput && frequencyInput) {
            // Grabs user input
            var trainName = $("#input-name").val().trim();
            var destination = $("#input-destination").val().trim();
            var hour = $("#input-first-time-hour").val().trim();
            var minutes = $("#input-first-time-minute").val().trim();
            var sHour = hour.toString();
            var sMinutes = minutes.toString();
            var firstTrainTime = (sHour + ":" + sMinutes);
            var frequency = $("#input-frequency").val().trim();

            //Uploads train data to the database including the document id thats randomly generated and assigned on the push of data
            var autoID = database.ref().push().key

            database.ref().child(autoID).set({
                name: trainName,
                destination: destination,
                firstTrainTime: firstTrainTime,
                frequency: frequency,
                autoID: autoID
            })  

            // Clears all of the text-boxes
            $("#input-name").val("");
            $("#input-destination").val("");
            $("#input-first-time-hour").val("");
            $("#input-first-time-minute").val("");
            $("#input-frequency").val("");

            updateTimetable();
        }
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

        $(".input-name-current").empty();
    }

    //to update timetable every minute or when new train schedules are added
    function updateTimetable() {

        DeleteRows();

        //adding an initial dropdown option with instructions
        var editContentOptionBlank = $("<option></option>");
        editContentOptionBlank.attr('value', "Select Train Schedule to Edit");
        editContentOptionBlank.text("Select Train Schedule to Edit");

        $(".input-name-current").append(editContentOptionBlank);

        database.ref().on("child_added", function (childSnapshot) {

            // Store everything into a variable.
            var trainName = childSnapshot.val().name;
            var destination = childSnapshot.val().destination;
            var firstTrainTime = childSnapshot.val().firstTrainTime;
            var frequency = childSnapshot.val().frequency;

            var id = childSnapshot.val().autoID;

            //creating the buttons to be added to each row
            var deleteButton = $("<button id='deleteButton'>Delete</button>");

            var editContentOption = $("<option></option>");
            editContentOption.attr({
                'label': trainName,
                'value': trainName,
                'data-selected': trainName,
                'data-id-delete': id
                });
            editContentOption.text(trainName);

            $(".input-name-current").append(editContentOption);

            //add a data attribute containing the 'document id' (the auto generated number for each row)
            deleteButton.attr('data-id-delete', id);

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
                $("<td>").html(deleteButton),
            );

            // Append the new row to the table
            $("tbody").append(newRow);
        });
    }

    //on click function for the delete button to delete the node in the database and re-render the timetable
    $(document).on('click', '#deleteButton', function () {

        buttonValue = $(this).attr("data-id-delete");
        database.ref().child(buttonValue).remove();
        updateTimetable();
    });

    //to capture id of dropdown option selected and storing the id to the edit button for each time it's selected
    $('select.input-name-current').change(function () {
        var editButtonValue = $('select.input-name-current').find(':selected').attr('data-id-delete');
        $(".edit-train-button").attr("id", editButtonValue);
    });

    //for whatever dropdown option is selected, the edit button id will match the node id and use 
    $(".edit-train-button").on("click", function (event) {
        event.preventDefault();

        var selectedOption = $(this).attr("id");

        var newTrainName = $("#input-name-edit").val().trim();
        newTrainNameInput = $("#input-name-edit").val();

        var newDestination = $("#input-destination-edit").val().trim();
        newDestinationInput = $("#input-destination-edit").val()

        var newHour = $("#input-first-time-hour-edit").val().trim();
        var newMinutes = $("#input-first-time-minute-edit").val().trim();
        var newSHour = newHour.toString();
        var newSMinutes = newMinutes.toString();
        var newFirstTrainTime = (newSHour + ":" + newSMinutes);
        newHourInput = $("#input-first-time-hour-edit").val();
        newMinutesInput = $("#input-first-time-minute-edit").val();

        var newFrequency = $("#input-frequency-edit").val().trim();
        newFrequencyInput = $("#input-frequency-edit").val();

        if (newTrainNameInput) {
            database.ref().child(selectedOption).update({
                "name": newTrainName
            });
        }
        if (newDestinationInput) {
            database.ref().child(selectedOption).update({
                "destination": newDestination
            });
        }
        if (newHourInput && newMinutesInput) {
            database.ref().child(selectedOption).update({
                "firstTrainTime": newFirstTrainTime
            });
        }
        if (newFrequencyInput) {
            database.ref().child(selectedOption).update({
                "frequency": newFrequency
            });
        }

        updateTimetable();

        $("#input-name-edit").val("");
        $("#input-destination-edit").val("");
        $("#input-first-time-hour-edit").val("");
        $("#input-first-time-minute-edit").val("");
        $("#input-frequency-edit").val("");
    });

});
