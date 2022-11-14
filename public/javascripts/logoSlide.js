

function logoSlide(){
   document.addEventListener('scroll', function(){
    console.log('logoSlide running')
    const docH = document.body.scrollHeight
    const winPos =window.scrollY
    const winH = window.innerHeight
    const winTot = winPos+winH
    console.log('docH:'+docH)
    console.log('winPos:'+winPos)
    console.log('winH'+winH)
    console.log('winTot'+winTot)
    if(winPos<180){
        menu.style.backgroundImage=""
    }else{
        menu.style.backgroundImage="url('../images/logo_thumb.png')"
    }
    })
}