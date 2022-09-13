function slide(){
    const bkgrdImage = document.getElementById('bkgrdImage');
    const bkImg = bkgrdImage.getAttribute('src');
   
  
    let x =0;
    if(x<2){
        doSomething(100,0,'i--');
        bkgrdImage.src='images/bkgrd_'+x+'.jpg';
         x--;
      
    }
   
}     
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

const doSomething = async (zed0,zed1,zed2) => {

    for (let i = zed0; i > zed1; i+zed2) {
        bkgrdImage.style= '"transform:opacity('+i+'%)"'
        await sleep(50)
        console.log(i)
    }
 


  }
  