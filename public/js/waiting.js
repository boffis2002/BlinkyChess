document.addEventListener('DOMContentLoaded', () => {
    let found=false;
    api.getGames().then((Games) => {
        let time=sessionStorage.getItem("time")
        let ranked=sessionStorage.getItem("ranked")
        sessionStorage.removeItem("id");
        for(let i=0;i<Games.length;i++){
            let _id=Games[i]._id
            if(Games[i].white==sessionStorage.getItem("username")){
                api.getGame(Games[i]._id).then((game)=>{
                    window.setInterval(()=>{
                        if(game.black!="") window.location.href="game/"+game._id+"/w"
                    },1000)
                    sessionStorage.setItem("id",_id);
                })
                found=true;
                break;
                
            }
            if((Games[i].black==""&&Games[i].btime==time &&Games[i].ranked==ranked )||Games[i].black==sessionStorage.getItem("username")){
                let username=(sessionStorage.getItem("username"));
                api.insertBlack(_id,{black:username}).then(()=>{
                    window.location.href="game/"+_id+"/b";
                    sessionStorage.setItem("id",_id);
                });
                found=true;
                break;
            }
        }
        if (found==false){
            let Board="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

            let _username=sessionStorage.getItem("username");
            let game={
                white: _username,
                black: "",
                board: Board,
                ranked:ranked,
                wtime:time,
                btime:time
            };
            
            api.addGame(game).then((GAME) => {
                sessionStorage.setItem("id",GAME._id);
                window.setInterval(()=>{
                    api.getGame(GAME._id).then((game)=>{
                        if(game.black!="") window.location.href="game/"+game._id+"/w"
                    })
                },1000)
            });

        }
    })
    
});
