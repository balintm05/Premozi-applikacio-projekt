$(document).ready(function() {
    $(".leiras").click(function(){
        if ($(this).hasClass("szukleiras")) {
            $(this).removeClass("szukleiras");
        } else {
            $(this).addClass("szukleiras");
        }
    });
    
    $(".film-plakat").mouseover(function(){
        $("#yt-"+$(this).attr("ea")).removeClass("d-none");
    });
    
    $(".film-plakat").mouseout(function(){
        $("#yt-"+$(this).attr("ea")).addClass("d-none");
    });
    
    
    $('#myModal').on('hidden.bs.modal', function () {
        player.pauseVideo();
    });
    
    $(".tovabbi").click(function(){
        console.log("hello");
        ea = $(this).attr("itemId");
        console.log(ea);
        if ($("#tovabbi-"+ea).hasClass("d-none")) {
            console.log("van");
            $("#tovabbi-"+ea).removeClass("d-none");
        } else {
            $("#tovabbi-"+ea).addClass("d-none");
            console.log("nincs");
        }
    });
    
});