console.log("Hello there!");
console.log("Feel free to take a look around at thre front end code to see how I structure things.");
console.log("You can also view a public repository of this site on my GitHub (https://github.com/digitalclover/jmdotworks) to see the original development files before being processed.");
console.log("Thanks for visiting!")

const page = document.getElementsByTagName('BODY')[0],
    topBtn = document.getElementById('scrollTop');

page.onscroll = function(){
    if(page.scrollTop > 300){
        topBtn.classList.add('active');
    }else{
        topBtn.classList.remove('active');
    }
};

topBtn.onclick = function(){
    page.scrollTop = 0;
    topBtn.classList.remove('active');
};
