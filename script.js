var fonts = document.getElementsByClassName("font-theme");
var lines = document.getElementsByClassName("line");
var navlinks = document.getElementsByClassName("nav-link");
var isRed = true;

function changeTheme(event){
    var noRedirect = '.center-div *';
    if (!event.target.matches(noRedirect)) {
        var background = document.getElementById("background");
    
        if(isRed){
            background.style.backgroundColor="#FFFFFF";
            for(var i=0; i< fonts.length; i++){
                fonts[i].style.color="#8B0000";
            }
            for(var i=0; i< lines.length; i++){
                lines[i].style.borderColor="#8B0000";
            }
            for(var i=0; i< navlinks.length; i++){
                navlinks[i].style.borderColor="#8B0000";
            }
            isRed = false;
        }
        else{
            background.style.backgroundColor="#8B0000";
            for(var i=0; i< fonts.length; i++){
                fonts[i].style.color="#FFFFFF";
            }
            for(var i=0; i< lines.length; i++){
                lines[i].style.borderColor="#FFFFFF";
            }
            for(var i=0; i< navlinks.length; i++){
                navlinks[i].style.borderColor="#FFFFFF";
            }
            isRed = true;
        }
    }
}

document.getElementById("background").addEventListener('click',changeTheme);