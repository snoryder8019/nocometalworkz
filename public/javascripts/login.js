const localSignin = document.getElementById('localSignin')
const localRegister = document.getElementById('localRegister')
const oauthBody = document.getElementById('oauthBody')
const gglMsg = document.getElementById('gglMsg')
const regGroup = [localRegister,oauthBody]
const loginGroup = [localSignin,oauthBody]
const allGroup = [localSignin,oauthBody,localRegister]

function loginSwap(zzx,zzz){
for (let i=0;i<allGroup.length;i++){
    allGroup[i].style.display="none"    
}
for (let x=0;x<zzx.length;x++){
    zzx[x].style.display="block"
    gglMsg.innerHTML=""
    gglMsg.innerHTML=zzz
}
}