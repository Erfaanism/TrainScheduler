$(document).ready(function(){

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyD5UZPlc6Z4utFpkKF-gt2a8BXGoRPwSAc",
		authDomain: "trainscheduler-fb.firebaseapp.com",
		databaseURL: "https://trainscheduler-fb.firebaseio.com",
		projectId: "trainscheduler-fb",
		storageBucket: "trainscheduler-fb.appspot.com",
		messagingSenderId: "327796329728"
	};
	firebase.initializeApp(config);

	const db = firebase.database();
	const dbRoot = db.ref();

	var arrTrainIDs = [];
	var strName = "";
	var strDestination = "";
	var strFirst = "";
	var strFirstConverted = "";
	var intFrequency = 0;
	var intAway = 0;
	var strArrival = "";
	var intCounter = 1;
	$(".form-control").val("");
	dbRoot.on("value", function(snap){
		if (snap.numChildren() === 0) {
			intCounter = 0;
			$("#tableBody").css("display", "none");
			$("#tableError").html("<span>Currently There Are No Trains Scheduled!</span>").css("display", "block");
		}
		else if (snap.numChildren() > 1) {
			$("#tableBody").html("");
			for (var i = 1; i < snap.numChildren(); i++) {
				intCounter = parseInt(snap.child("TrainCounter/Counter").val());
				strName = snap.child("Train" + i + "/Name").val();
				strDestination = snap.child("Train" + i + "/Destination").val();
				strFirst = snap.child("Train" + i + "/First").val();
				strFirstConverted = moment(strFirst, "HH:mm").subtract(1, "years");
				intFrequency = parseInt(snap.child("Train" + i + "/Frequency").val());
				intAway = parseInt(intFrequency - ((moment().diff(moment(strFirstConverted), "minutes")) % intFrequency));
				strArrival = moment(moment().add(intAway, "minutes")).format("HH:mm");		
				var newRow = $("<tr>");
				newRow.html("<td>" + strName + "</td><td>" + strDestination + "</td><td>Every " + intFrequency + " Minutes</td><td>" + strArrival + "</td><td>" + intAway + " Minutes</td>");
				$("#tableBody").append(newRow);
			}	
			$("#tableBody").css("display", "contents");
			$("#tableError").css("display", "none");
		}
		else {
			$("#tableBody").css("display", "none");
			$("#tableError").html("<span>Database Corrupted</span>").css("display", "block");
		}
	})

	function addTrain() {
		if (intCounter < 1) {
			intCounter = 1
		}
		strName = $("#trainName").val();
		strDestination = $("#trainDestination").val();
		strFirst = $("#trainFirst").val();
		intFrequency = parseInt($("#trainFrequency").val());
		db.ref("Train" + intCounter).set({
			"Name": strName,
			"Destination": strDestination,
			"First": strFirst,
			"Frequency": intFrequency
		});
		db.ref("TrainCounter").set({
			Counter: (parseInt(intCounter) + 1)
		})
		$(".form-control").val("");
	}

	$("#addButton").on("click", function (event) {
		event.preventDefault();
		if ($("#trainName").val() !== "" && $("#trainDestination").val() !== "" && $("#trainFirst").val() !== "" && $("#trainFrequency").val() !== "") {
			addTrain();
		}
	})
})