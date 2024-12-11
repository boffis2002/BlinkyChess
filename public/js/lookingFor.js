document.addEventListener('DOMContentLoaded', () => {
    let row1=document.querySelectorAll("#match-row1 button");
    let row2=document.querySelectorAll("#match-row2 button");
    let row3=document.getElementById("match-row3")
    row1.forEach(button => {
        button.addEventListener("click",(e)=>{
            if(e.srcElement.classList[0]=="btnChoose"){
                let tochange=document.querySelector('#match-row1 button[class="btnChooseactive"]');
                tochange.className="btnChoose";
                e.srcElement.className="btnChooseactive";
            }
        })
    });
    row2.forEach(button => {
        button.addEventListener("click",(e)=>{
            if(e.srcElement.classList[0]=="btnChoose"){
                let tochange=document.querySelector('#match-row2 button[class="btnChooseactive"]');
                tochange.className="btnChoose";
                e.srcElement.className="btnChooseactive";
            }
        })
    });
    row3.addEventListener("click",(e)=>{
        let time=document.querySelector('#match-row1 button[class="btnChooseactive"]')
        let ranked=document.querySelector('#match-row2 button[class="btnChooseactive"]')
        time=time.textContent.slice(0,2)*60;
        ranked=="Ranked"?ranked=true:ranked=false;
        sessionStorage.setItem("time",time)
        sessionStorage.setItem("ranked",ranked)
        window.location.href="home/game";
    })
});
function closePopUp(){
   let div= document.querySelector(".choose-match");
   div.style.display="none"
}