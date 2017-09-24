var conData = [["Satoshis", 0.01], ["uBTC", 0.001], ["mBTC", 0.1], ["cBTC", 0.01], ["BTC", 1]]; // Conversion Units Array
var runOnce = false;

function AddZero(i){ // Workaround to add 0 to numbers that are less than 10
	if (i < 10){
		i = "0" + i;
	}
	return i;
};

function RoundUp(i){ // Workaround for currencies below 1
	if (i > 0.9999){
		i = Math.round(i);
	}
	else
	{
		i = parseFloat(Math.round(i * 100) / 100).toFixed(2);
	}
	return i;
};

function OptionsMenu(){
	var optionsDiv = document.getElementById("optionsM"); // Defining the ID of menu
	var coverDiv = document.getElementById("cover"); // Defining the ID of cover

	if(optionsDiv.style.display == "none" && coverDiv.style.display == "none"){

		$("#optionsM").animate({
			top: "+=0",
			height: "toggle"
		})
		optionsDiv.style.display = "block";
		coverDiv.style.display = "block";
	}
	else
	{
		$("#optionsM").animate({
			bottom: "-=0",
			height: "toggle"
		}, 500, function(){
		optionsDiv.style.display = "none";
		coverDiv.style.display = "none";
		});
	}
};

function DocumentLoad(){
	$("#optionsB").click(OptionsMenu);
};

$(document).ready(DocumentLoad); // Run DocumentLoad when HTML is loaded

// Credits to Waleedalqalaf, Stackoverflow, JQuery, w3schools and me!