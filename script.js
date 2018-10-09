var fonts = document.getElementsByClassName("font-theme");
var lines = document.getElementsByClassName("line");
var navlinks = document.getElementsByClassName("nav-link");
var background = document.getElementById("background");
var currentcolor = -1;
var colorlist = [];

function color(bColor, fColor){
    this.bColor = bColor;
    this.fColor = fColor;
}

function changeTheme(event){
    var noRedirect = '.center-div *';
    if (!event.target.matches(noRedirect)) {
        var mrandom = getRandom(colorlist.length-1);
        while(mrandom === currentcolor){
            mrandom = getRandom(colorlist.length-1);
        }
        background.style.backgroundColor = colorlist[mrandom].bColor;
        for(var i=0; i< fonts.length; i++){
            fonts[i].style.color=colorlist[mrandom].fColor;
        }
        for(var i=0; i< lines.length; i++){
            lines[i].style.borderColor=colorlist[mrandom].fColor;
        }
        for(var i=0; i< navlinks.length; i++){
            navlinks[i].style.borderColor=colorlist[mrandom].fColor;
        }
        currentcolor = mrandom;
    }
}

function getRandom(max){
    return Math.floor(Math.random() * Math.floor(max));
}

colorlist.push(new color("#1E1E1E","#FF6600"));
colorlist.push(new color("#8B0000","#FFFFFF"));
colorlist.push(new color("#FFA500","#000000"));
colorlist.push(new color("#FF6600","#1E1E1E"));
colorlist.push(new color("#FFFFFF","#8B0000"));
colorlist.push(new color("#000000","#FFA500"));

document.getElementById("background").addEventListener('click',changeTheme);
//document.getElementById("background").click();