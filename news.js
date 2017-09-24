function UpdateNews(){
    var newsAPI = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcointelegraph.com%2Frss";
    $.get(newsAPI, function(data){
        $("#news").html("");
        var newsObject = data["items"];
        for(var i = 0; i < newsObject.length; i++)
        {
            $("#newsMarquee").append("<a class='link' href=" + newsObject[i]["guid"] + ">" + newsObject[i]["title"] +"<a> || ");
        }
    });
}

function DocumentLoad(){
    $("#newsMarquee").mouseover(function(){
        document.getElementById("newsMarquee").stop();
    });

    $("#newsMarquee").mouseout(function(){
        document.getElementById("newsMarquee").start();
    });

    $("#newsMarquee").html("");

    UpdateNews();

    setInterval(UpdateNews, 20000);
}

$(document).ready(DocumentLoad);