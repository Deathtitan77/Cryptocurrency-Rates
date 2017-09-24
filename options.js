function ChangeBackground(){
    $("div").css("background-color", "blue");
    alert("heya");
}



function DocumentLoad(){
    $("#bgColor").on("input", function(){
        ChangeBackground();
    });
}

$(document).ready(DocumentLoad);