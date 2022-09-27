
function getCart(){
    const cartDiv= document.getElementById('cartDiv')
    console.log('getcart')
    if(cartDiv.style.display="none")cartDiv.style.display="block";
}

function shrinkCart(){
    const cartDiv= document.getElementById('cartDiv')
    console.log('shrinkcart')
   if(cartDiv.style.display="none")cartDiv.style.display="none";
}