function FindID(name, arr){
    for(var i=0; i<arr.length; i++)
    if(arr[i][0] == name)
    return i;
    return -1;
};
   
function Converter(val, from, to){
   if(from == to) return val;
   var fromId = FindID(from, conData);
   var toId = FindID(to, conData);
   var res = val;
   if(fromId<toId)
       for(var i=fromId; i<toId; i++)
           res *= conData[i][1];
   else
       for(var i=fromId-1; i>=toId; i--)
       res /= conData[i][1]; 
   return res;
};
   
function Writer(){
    var selectFirst = $("#first");
    var selectSecond = $("#second");
    var inputV = $("#value"); // Variable for input
    var outputR = $("#result"); // Variable for output

    if (selectFirst.val() == selectSecond.val()){ // If select is the same, so is the value: Avoiding unnecessary computing power
        outputR.val(inputV.val());
    };

    outputR.val(Converter(inputV.val(), selectFirst.val(), selectSecond.val()));
    
    selectFirst.change(function(){ // Remove text on select change
        outputR.val(Converter(inputV.val(), selectFirst.val(), selectSecond.val()));
    });

    selectSecond.change(function(){
        outputR.val(Converter(inputV.val(), selectFirst.val(), selectSecond.val()));
    });
};

function DocumentLoad(){
    $("#value").on("input", Writer);
};

$(document).ready(DocumentLoad);