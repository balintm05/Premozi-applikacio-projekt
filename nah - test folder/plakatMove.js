function resizePlakatImg() {
    wp = document.getElementById("plakatholder").offsetWidth;
    
    // if (wp<2000) {
    if ($("#plakatholder:hover").length===0) {
        if (wp!==woldp) {
            document.getElementById("plakatholder").scrollLeft = 0;
            woldp=wp;
        }
        dbp = 2; 
        if (wp>600)  {dbp = 3;} 
        if (wp>800)  {dbp = 4;} 
        if (wp>1000) {dbp = 6;} 
        if (wp>2000) {dbp = 9;}  

            sp = parseInt(wp/dbp); ; hp = sp*1.46;
            $("#plakatholder div").css("width",sp+"px");
            $("#plakatholder div.flip-card").css("width",sp+"px").css("height",hp+"px");            
            $(".img-plakat").css("width",sp+"px").css("height",hp+"px");            
            itemPlakat = $('#plakatholder div:first-child')[0].outerHTML;
            
        if ($("#plakatholder > div").length > dbp) {                
            $('#plakatholder').stop().animate({scrollLeft: "+="+sp}, 400, function(){
                $('#plakatholder div').first().remove();
                document.getElementById("plakatholder").scrollLeft = 0;
                $('#plakatholder').append(itemPlakat);
            });        
        }
    }
}


var posp = 0; var wp; var woldp; var hp;
$(document).ready(function() {
    wp = document.getElementById("plakatholder").offsetWidth;
    woldp = wp;  dbp = 2;
    if (wp>600)  {dbp = 3;} 
    if (wp>800)  {dbp = 4;} 
    if (wp>1000) {dbp = 6;} 
    if (wp>2000) {dbp = 9;}  
    sp = parseInt(wp/dbp); hp = parseInt((sp*1.46));
    $("#plakatholder div").css("width",sp+"px");
    $("#plakatholder div.flip-card").css("width",sp+"px").css("height",hp+"px");
    $(".img-plakat").css("width",sp+"px").css("height",hp+"px");
    document.getElementById("plakatholder").scrollLeft = 0;
    setInterval(resizePlakatImg,2000);
    
    
    $('body').on('mouseover', '.flip-card', function() {
        console.log("flippp....");
        vid = $(this).attr("itemid");
        $("#buttons").html($("#v"+vid).html());
    });
    
    $('body').on('mouseover', '.nav', function() {
        $("#buttons").html("");
    });
    
    
    
});