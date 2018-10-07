console.log("Ikuze!!");

var config = {
  apiKey: "AIzaSyDOmg3PGSpxQ_oJX8bQV91aqFS1Hhfrv4M",
  authDomain: "class-activites.firebaseapp.com",
  databaseURL: "https://class-activites.firebaseio.com",
  projectId: "class-activites",
  storageBucket: "class-activites.appspot.com",
  messagingSenderId: "151778208628"
};
firebase.initializeApp(config);

var database = firebase.database();


var tFrequency = 45;


var firstTime = "06:45";

var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var tName = $("#train-name-input").val().trim();
  var tDest = $("#destination").val().trim();
  var tTime = moment($("#train-time").val().trim(), "HH:mm").format("X");
  var tFreq = $("#train-frequency").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: tName,
    destination: tDest,
    time: tTime,
    frequency: tFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  alert("New train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#train-frequency").val("");
});

// 3. Create Firebase event for train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDest = childSnapshot.val().destination;
  var tTime = childSnapshot.val().time;
  var tFreq = childSnapshot.val().frequency;


  // Prettify the train time
  var tTimePretty = moment.unix(tTime).format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(tName),
    $("<td>").text(tDest),
    $("<td>").text(tFreq),
    $("<td>").text(tTimePretty),
    $("<td>").text(tMinutesTillTrain),
    
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
