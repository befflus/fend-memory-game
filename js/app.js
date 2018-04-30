/*******************************************************VARIABLES*************************************************/



// An array that holds all the cards

const defaultArray = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 
				'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle',
				'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 
				'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle',
				'fa-bomb'];


let checkArray = []; // Array used to compare two cards during the game
let shuffledCards; // Holds an array after shuffled function is called
let target; // Holds the event.target
let timeout; // Timer
let moveCounter = 0; // Counter that keep track on every card click
let matchedCards = 0; // Holds the value of matched cards. Used to start timer and check for game end.
let winner = false; // Boolean that will be true when matchedCards is === 8
let movesDisplay = document.querySelector('.moves'); // Selector for updating innerHTML for the movesDisplay
let refreshGame = document.querySelector('.restart') // Selector for the refresh button 
let eventHolder = document.querySelector('.deck'); // Selector for .deck <div>
let modal = document.querySelector('#showModal'); // Selector for the modal 
let playTime = document.querySelector('#playtime'); // Selector for the span in modal to display played time
let movesModal = document.querySelector('#moves-modal'); // Selector for the span in modal to display moves done
let starScore = document.querySelector('#star-rating'); // Selector for the span in modal to dispaly the star rating
let closeModal = document.querySelector('.close'); // Selector for the button to close the modal
let playAgain = document.querySelector('#button-playagain'); // Selector for the play again button
let timerSelector = document.querySelector('.stopwatch'); // Selector for the time displayed during gameplay
let starSelector = document.querySelector('.stars'); // Selector for the star rating displayed on page/modal
let seconds = 0, minutes = 0; // Time is inintiated here
    


/********************************************FUNCTION DECLARATIONS*************************************************/

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// create default HTML content together with the shuffle function

function initialDeck() {

	// shuffle and assign classes from defaultArray. 
  	
  	shuffledCards = shuffle(defaultArray);
  
  	//for loop to create HTML for 16 cards

	for(let i = 0; i < 16; i++) {
		// Create <li> tag, give class name.
		let card = document.createElement('li');
		card.classList.add('card');
		card.setAttribute('name', shuffledCards[i]);
		
		// Create an <i> element and its classes
		let item = document.createElement('i');
		item.classList.add('fa');
		item.classList.add(shuffledCards[i]);
		
		// Append classes to <i> element 		
		card.appendChild(item); 
		// Append card to element
		document.getElementById('card-deck').appendChild(card); 
	};
}

function playGame() {

//if restart icon is clicked the restart function will run
refreshGame.addEventListener('click', restart);

// Eventlistener for the cards displayed 
eventHolder.addEventListener('click', function listener(event) {
	target = event.target;

	// If a <li> element is clicked this happens 
	if (target.tagName === 'LI') {
		clickedCard();
		cardCheck();
			
		// When the second card is clicked the event listener will be disabled
		if (checkArray.length >= 2 ){
			eventHolder.removeEventListener('click', listener);

			console.log('clicks disabled');
			} 
	}else{
		return;
		}
	})
}


function clickedCard() {
		
		// Clicked element goes into the array
		checkArray.push(target);
		// After each click movecounter is increased by 1
		moveCounter += 1;
		// Function for rating how good you are in this game
		starRating();
		// Timer is started here by the first click on a card
		if (moveCounter === 1) {
			timer();
		}
	}


function cardCheck() {

	// Function for comparing the cards. When the first card is clicked just show the card. (the last else)
	
	if (checkArray.length <= 2) {		

		// When array have 2 cards
		if (checkArray.length === 2) {

			// show the second card and display the moves (2 opened card is 1 move)
			showCard(target);
			movesDisplay.innerHTML = moveCounter / 2;
		
		// Give the two items in checkArray variable names 
		let firstCard = checkArray[0];
		let secondCard = checkArray[1];
		
		// The html is compared to see if they are the same
		if (firstCard.innerHTML === secondCard.innerHTML){
			
			// This is a tracker to check when the game is finished.
			matchedCards += 1;
			if (matchedCards === 8) {
				winner = true;				
				
				// show winning modal.
				showModal();

			}
			// When cards is a match
			itsaMatch(firstCard, secondCard);

		// If the cards is not a match they will hide
		} else {
			hideCards(firstCard, secondCard)
		}
	} else {
		showCard(target);
	}
}
}

function starRating() {

	// You loose one star when you get to 17 clicks. (The best is 16 to finish the game) 
	if (moveCounter === 17) {
		starSelector.children[0].remove();
	// You loose another star at 34 clicks
	} else if (moveCounter === 34 ) {
		starSelector.children[0].remove();
	} else {
		return;
	}
}


// time function inspiration from https://jsfiddle.net/Daniel_Hug/pvk6p/
function timer() {
  	
  	// If game is finished this will run to stop the time
  	if (winner) {
    	clearTimeout(timeout);
    	return;
    }
  	// If no winner yet continue  to count in add function 
  	timeout = setTimeout(add, 1000);
}

function add() {

	// This code keeps track of gametime. Gets incremented by 1 when run every second
    seconds++;

    if (seconds >= 60) {
    	// This reset seconds and increments minutes by 1.
        seconds = 0;
        minutes++;
     }

    // This is the text displayed for the timer
    timerSelector.children["0"].innerHTML = "<i>" + "Time:  " + minutes + "<span>mins</span>" + seconds + "<span>seconds</span>" + "</i>";

    // Timer called again every second
    timer();
}

function showCard(show) {

	// When run, this code will add open and show classes to the <li> element clicked to display the card

	show.classList.add("open", "show");
}

function hideCards(firstCard, secondCard) {

	// This function will hide the cards 0.8 secs after opening

    setTimeout (function() {
    	firstCard.classList.remove("open", "show");
    	secondCard.classList.remove("open", "show");
    	},800);

    // Items in the checkarray is removed here
    checkArray = []; 
}

function itsaMatch(firstCard, secondCard) {

	// When card match, classes are removed and new added

	firstCard.classList.remove("open", "show");
	secondCard.classList.remove("open", "show");	
	firstCard.classList.add("match");
	secondCard.classList.add("match");
	
	// Checkarray is cleared here also
	checkArray = [];
}

function showModal() {

	// This will bring up the modal
 	modal.style.display = 'block';

 	// These lines updates the Span elements in the modal
 	playTime.innerHTML = " " + minutes + "  minutes " + (seconds + 1) + " seconds ";
 	starScore.innerHTML = starSelector.innerHTML;
 	movesModal.innerHTML = moveCounter / 2;

 	// Eventlistener for the clicks on the X button on modal  
 	closeModal.addEventListener('click', function close(event) {
	modal.style.display = 'none';
	})

	// Eventlistener for the play again button	
	 playAgain.addEventListener('click', function newGame(event) {
 	modal.style.display = 'none';
 	
 	restart();
 
})
}

function restart() {
	
	// This reloads the page giving you a new game
	location.reload();
}




/*******************Game Runs**************************/
initialDeck();
playGame();



