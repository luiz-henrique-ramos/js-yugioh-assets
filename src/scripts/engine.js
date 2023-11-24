const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
        button: document.getElementById("next-duel")
    }
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: pathImages + "dragon.png",
        winOf:[1],
        loseOf:[2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: pathImages + "magician.png",
        winOf:[2],
        loseOf:[0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: pathImages + "exodia.png",
        winOf:[0],
        loseOf:[1]
    }
]

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("width", "69.44px")
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");
    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(IdCard);
        })
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }  
    return cardImage;
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showRidenCardsFieldImages();

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId)
    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showRidenCardsFieldImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}
async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId]

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }
    
    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win :${state.score.playerScore} | Lose :${state.score.computerScore}`;
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute :" + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
    }
    init();
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
}

function init(){
    showRidenCardsFieldImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();


