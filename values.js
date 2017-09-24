function SelectCrypto(){
    
        var cryptoSelection = $("#crypto option:selected").val();
        var cryptoSelectText = $("#crypto option:selected").text();
    
        var selectedCryptoValue = cryptoSelection;
        return [selectedCryptoValue, cryptoSelectText];
    };
    
    function SelectCurrency(){
        var currencySelection = $("#currency option:selected").val();
        var currencySelectText = $("#currency option:selected").text();
    
        var selectedCurrencyValue = currencySelection;
        return [selectedCurrencyValue, currencySelectText];
    };
    
    function SaveData(){
        var selectedCurrency = {Value: SelectCurrency()[0], Name: SelectCurrency()[1]};
        var selectedCrypto = {Value: SelectCrypto()[0], Name: SelectCrypto()[1]};
    
        chrome.storage.local.set(
            {
                "selectedData": 
                {
                    "selectedCurrency": selectedCurrency, 
                    "selectedCrypto": selectedCrypto
                }
            }
        );
    };
    
    function LoadData(){
        chrome.storage.local.get("selectedData", function(data){ // Load previous selected data
            if (data.selectedData == null){
                $("#status").html("No prior saved options. Please choose your options");
                OptionsMenu();
            }
            else
            {
                $("#status").html("Your previous settings have been loaded");
    
                var selectedCrypto = data.selectedData.selectedCrypto.Value;
                var selectedCurrency = data.selectedData.selectedCurrency.Value;
    
                $("#currency").val(selectedCurrency);
                $("#crypto").val(selectedCrypto);
            }
        });
    }

function UpdateRates(){
	LoadData();
	runOnce = true;
	if(runOnce){
		var selectedCurrency = SelectCurrency();
		var selectedCurrencyValue = selectedCurrency[0];
		var selectedCurrencyText = selectedCurrency[1];
		var selectedCrypto = SelectCrypto();
		var selectedCryptoValue = selectedCrypto[0];
		var selectedCryptoText = selectedCrypto[1];
		var cryptoBadgeUpdate = ["images/cryptodown.png", "images/cryptoup.png", "images/cryptosame.png"];
		var cryptoHTMLUpdate = ["images/down.png", "images/up.png", "images/same.png"];
		var cryptoUpdateSelection;

		var krakenAPI = "https://api.kraken.com/0/public/Spread?pair=" + selectedCryptoValue + selectedCurrencyValue;
		var krakenTicker = "https://api.kraken.com/0/public/Ticker?pair=" + selectedCryptoValue + selectedCurrencyValue;

		$.get(krakenTicker, function(data){
			var cryptoData = data["result"][selectedCryptoValue + selectedCurrencyValue];
			olderValue = RoundUp(cryptoData["l"][1]);
		})
		
		$.get(krakenAPI, function(data){ // Async function
			var cryptoData = data["result"][selectedCryptoValue + selectedCurrencyValue]; // Selected Cryptocurrency to Selected Currency
			var currentValue = RoundUp(cryptoData[cryptoData.length-1][1]);
			var currentTime = cryptoData[cryptoData.length-1][0];
			var currentUNIX = new Date(currentTime * 1000);
			var currentDate = AddZero(currentUNIX.getHours()) + ":" + AddZero(currentUNIX.getMinutes());

			if(currentValue < olderValue){
				cryptoUpdateSelection = 0;
			}
			else if(currentValue > olderValue)
			{
				cryptoUpdateSelection = 1;
			}
			else if(currentValue == olderValue)
			{
				cryptoUpdateSelection = 2;
			}

			chrome.browserAction.setBadgeBackgroundColor({color:[128, 0, 0, 255]}); // Badge data
			chrome.browserAction.setBadgeText({text:currentValue.toString()});
			chrome.browserAction.setTitle({title:selectedCryptoText + ": " + currentValue + " " + selectedCurrencyValue});
			chrome.browserAction.setIcon({path: cryptoBadgeUpdate[cryptoUpdateSelection]});

			increaseDiff = currentValue - olderValue;
			increasePer = (increaseDiff / olderValue) * 100;
			
			$("#cryptotitle").html(selectedCryptoText + " Rates - " + selectedCurrencyValue + " <small>(" + selectedCurrencyText + ")</small>");
			
			$("tr[name*=results]").text(""); // Erasing previous data

			$("#current").append("<tr name='results'><td>" + currentValue + "<img id='cryptoHTML' src=" + cryptoHTMLUpdate[cryptoUpdateSelection] + "> " + increasePer.toFixed(2) + "%</td><td>" + currentDate + "</td></tr>");

			for(var i = 0; i < 10; i++) // Finding previous valuess
			{
				if(i < 5){
					var beforeUNIX = new Date(cryptoData[i][0] * 1000);
					var beforeDate = AddZero(beforeUNIX.getHours()) + ":" + AddZero(currentUNIX.getMinutes());
					$("#before1").append("<tr name='results'><td>" + RoundUp(cryptoData[i][1]) + "</td><td>" + beforeDate + "</td></tr>");
				}
				else
				{
					var beforeUNIX = new Date(cryptoData[i][0] * 1000);
					var beforeDate = AddZero(beforeUNIX.getHours()) + ":" + AddZero(currentUNIX.getMinutes());
					$("#before2").append("<tr name='results'><td>" + RoundUp(cryptoData[i][1]) + "</td><td>" + beforeDate + "</td></tr>");
				}
			};
		});
		runOnce = false;
	}
};

function DocumentLoad(){
    chrome.storage.local.get("selectedData", function(data){ // Load previous selected data
		if (data.selectedData == null){
			$("#status").html("No prior saved options. Please choose your options");
			OptionsMenu();
		}
		else
		{
			$("#status").html("Your previous settings have been loaded");

			var selectedCrypto = data.selectedData.selectedCrypto.Value;
			var selectedCurrency = data.selectedData.selectedCurrency.Value;

			$("#currency").val(selectedCurrency);
			$("#crypto").val(selectedCrypto);
			UpdateRates();
		}
	});
	$("body").on("click", "a", function(){ // Making <a href class> clickable
		if($(this).hasClass("link")){
			chrome.tabs.create({url: $(this).attr("href")});
			return false;
		}
	});

	$("#currency").on("input", function(){ // On change, change currency
		SaveData();
		UpdateRates();
	});
	$("#crypto").on("input", function(){ // On change, change cryptocurrency
		SaveData();
		UpdateRates();
	});
	setInterval(UpdateRates, 3500);
	$("#checkRates").click(UpdateRates);
};

$(document).ready(DocumentLoad); // Run DocumentLoad when HTML is loaded