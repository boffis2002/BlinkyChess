
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.home-button').addEventListener('click',(e)=>{
        e.preventDefault();
        window.location.href="/home"
    });
    let whitePlayer;
    let blackPlayer;
    let turno=false;
    const socket = io();
    const room = sessionStorage.getItem('id');
    socket.emit('join room', { room: room, user: sessionStorage.getItem('username')});
    api.getGame(sessionStorage.getItem('id')).then((game)=>{
        const chess = new Chess(game.board);
        let time;
        whitePlayer=game.white;
        blackPlayer=game.black;
        if(chess.turn()=="b"){
            time=game.btime;
            if(sessionStorage.getItem('username')==blackPlayer) turno=true;
        }
        if(chess.turn()=="w"){
            time=game.wtime;
            if(sessionStorage.getItem('username')==whitePlayer) turno=true;
        }
        if(chess.in_checkmate())time=0;
        if(chess.in_stalemate())draw("stalemate");
        if(chess.insufficient_material())draw("insufficient material");
        if(chess.in_threefold_repetition())draw("threefold repetition");
        if(turno==false&&time==0) {win(game);return;}
        else if(turno&&time<=0) {
            lose(game);
            return;
        }
        if(turno==false){
            window.setInterval(()=>{
                if (time!=0) {
                    time--;
                    document.querySelector(".timeHis").innerText="Time left: "+SecsToMins(time);
                }
            },1000)
        }
        else if (turno){
            window.setInterval(()=>{
                if (time!=0) {
                    time--;
                    document.querySelector(".timeMine").innerText="Time left: "+SecsToMins(time);
                }
                if(time==0){
                    let timew=game.wtime;
                    let timeb=game.btime;
                    chess.turn()=='w'?timew=time:timeb=time;
                    api.patchBoard(sessionStorage.getItem('id'),chess.fen(),timew,timeb).then(()=>{
                        socket.emit('move', { room: sessionStorage.getItem('id'), fen: chess.fen() });
                    });
                }
            },1000)
            let selectable = document.querySelectorAll('.chessboard div img[alt="selectable"]');
            const cells = document.querySelectorAll('.chessboard div img[alt="nothing"]');
            let oldcells=[];
            cells.forEach(cell => {
                let folder=cell.src.split("/")[cell.src.split("/").length-2]
                if((folder=="whites"&&chess.turn()=='w')||(folder=="blacks"&&chess.turn()=='b')){
                    cell.addEventListener('click', (event) => {
                        let chosens=document.querySelectorAll('.chessboard div img[alt="chosen"]');
                        if(chosens.length!=0){
                        chosens[0].alt="nothing";
                        chosens[0].style.border="0px";}
                        cell.alt="chosen";
                        cell.style.border = "2px solid #FF7F26";
                        cleanOldCells(oldcells);
                        oldcells=[];
                        let newcoordinates=NumToChar(cell.id);
                        let possibles=chess.moves({ square: newcoordinates });
                        possibles.forEach(coordinate => {
                            let newcoo=CharToNum(coordinate);
                            let cellToSelect = document.querySelector(`.chessboard div img[id="${newcoo}"]`);
                            oldcells.push([cellToSelect.id,cellToSelect.src])
                            cellToSelect.src="../../../images/whites/selected.png";
                            cellToSelect.class=coordinate;
                            cellToSelect.alt="selectable";
                            cellToSelect.style.opacity= 0.5;
                            cellToSelect.style.width="45%";
                            cellToSelect.style.height="45%";
                        });
                        selectable = document.querySelectorAll('.chessboard div img[alt="selectable"]');
                        selectable.forEach(selected =>{
                            selected.addEventListener('click',(event)=>{
                                let idgame=sessionStorage.getItem("id");
                                let timew=game.wtime;
                                let timeb=game.btime;
                                chess.turn()=='w'?timew=time+15:timeb=time+15;
                                if(selected.class.includes("=")){
                                    let popup2 = document.querySelector('.popup2');
                                    popup2.style.display="block";
                                    popup2.style.position="fixed";
                                    popup2.style.backgroundColor="rgba(0,0,0,0.8)";
                                    let mossa;
                                    document.getElementById("promotion").addEventListener("change",(e)=>{
                                        mossa=selected.class.split("");
                                        for(let i=0;i<mossa.length;i++){
                                            if(mossa[i]=="="){
                                                mossa[i+1]=e.target.value;
                                            }
                                        }
                                        mossa=mossa.join("");
                                        chess.move(mossa);
                                        api.patchBoard(idgame,chess.fen(),timew,timeb).then(()=>{
                                            socket.emit('move', { room: idgame, fen: chess.fen() });
                                        });
                                    })
                                }
                                else {
                                    chess.move(selected.class);
                                    api.patchBoard(idgame,chess.fen(),timew,timeb).then(()=>{
                                        socket.emit('move', { room: idgame, fen: chess.fen() });
                                    });
                                }
                                
                                
            
                            })
                        })
                    });
                }
                
            });
        }
        
    });
    
    socket.on('update board', (fen) => {
        location.reload();
    });
});

function SecsToMins(secs){
    return Math.floor(secs/60).toString()+":"+String(secs%60).padStart(2, '0')
}
function lose(game){
    let popup = document.querySelector('.popup');
    popup.style.display="block";
    popup.style.position="fixed";
    popup.style.backgroundColor="rgba(255, 21, 0,0.8)";
    let text = document.getElementById('popup-message');
    text.innerText="You lost the match!";
    api.getUser(sessionStorage.getItem("username")).then((user)=>{
        let stringa=user.lasts;
        stringa=stringa.split("");
        for(let i=1;i<10;i++) {
            stringa[i-1]=stringa[i];
        }
        stringa[9]="l";
        stringa=stringa.join("");
        let points=0;
        if(game.ranked) points=15;
        api.patchAfterGame(sessionStorage.getItem("username"),false,points,stringa).then();
        window.setTimeout(()=>{api.deleteGame(sessionStorage.getItem("id")).then()},1000)
    });    
    
}
function win(game){
    let popup = document.querySelector('.popup');
    popup.style.display="block";
    popup.style.position="fixed";
    popup.style.backgroundColor="rgba(0, 255, 0,0.8)";
    let text = document.getElementById('popup-message');
    text.innerText="You won the match!";
    api.getUser(sessionStorage.getItem("username")).then((user)=>{
        let stringa=user.lasts;
        stringa=stringa.split("");
        for(let i=1;i<10;i++) {
            stringa[i-1]=stringa[i];
        }
        stringa[9]="w";
        stringa=stringa.join("");
        let points=0;
        if(game.ranked) points=15;
        api.patchAfterGame(sessionStorage.getItem("username"),true,points,stringa).then();
    });
}
function draw(causa){
    let popup = document.querySelector('.popup');
    popup.style.display="block";
    popup.style.position="fixed";
    popup.style.backgroundColor="rgba(100,100,100,0.8)";
    let text = document.getElementById('popup-message');
    text.innerText="It's a draw! a "+causa+" happened";
    api.getUser(sessionStorage.getItem("username")).then((user)=>{
        let stringa=user.lasts;
        stringa=stringa.split("");
        for(let i=1;i<10;i++) {
            stringa[i-1]=stringa[i];
        }
        stringa[9]="d";
        stringa=stringa.join("");
        api.patchAfterGame(sessionStorage.getItem("username"),false,0,stringa).then();
        api.deleteGame(sessionStorage.getItem("id")).then();
    });
}
function cleanOldCells(oldcells){
    let alreadydone=[];
    oldcells.forEach(cell=> {
        if(!alreadydone.includes(cell[0])){
            alreadydone.push(cell[0]);
            let oldone = document.querySelector(`.chessboard div img[id="${cell[0]}"]`);
            oldone.src=cell[1];
            oldone.style.opacity= 1;
            oldone.style.width="100%";
            oldone.style.height="100%";
            if(cell[1]==""){oldone.style.width="0%";oldone.style.height="0%";oldone.removeAttribute('src');oldone.removeAttribute('alt');}
        }
    })
}
function NumToChar(coordinate){
    const lettera = String.fromCharCode(65 + parseInt(coordinate[1]));
    let altra=parseInt(coordinate[0])+1;
    let toret=(lettera+''+altra.toString()).toLowerCase();
    return toret;
}
function CharToNum(coordinate){
    for(let i=0;i<coordinate.length;i++){
        if(!isNaN(coordinate[i])){
            coordinate=coordinate[i-1]+coordinate[i]
        }
    }
    const numero = coordinate[0].charCodeAt(0) - 97;
    let altra=parseInt(coordinate[1])-1;
    let toret=altra+''+numero;
    return toret;
}