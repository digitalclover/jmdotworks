console.log(`Hello there!
Feel free to take a look around at thre front end code to see how I structure things.
You can also view a public repository of this site on my GitHub (https://github.com/digitalclover/jmdotworks) to see the original development files before being processed.
Thanks for visiting!")`);

const page = document.getElementsByTagName('HTML')[0],
    body = document.getElementsByTagName('BODY')[0],
    topBtn = document.getElementById('scrollTop');

body.scroll = ()=>{
    if(topBtn !== null){
        if(page.scrollTop > 300){
            topBtn.classList.add('active');
        }else{
            topBtn.classList.remove('active');
        }
    }
};

if(topBtn !== null){
    topBtn.onclick = ()=>{
        page.scrollTop = 0;
        topBtn.classList.remove('active');
    };
}
