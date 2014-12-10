$(function() {
  /////////////////////////
  //  SET UP THE WEBPAGE //
  /////////////////////////

  // grab the body and add two containers for the cards also make container darker color to see cards
  var $body = $("#container");
  $body.addClass('black-background');
  var $playersCards = $('<div>').attr('id', 'players_cards');
  var $dealersCards = $('<div>').attr('id', 'dealers_card');
  var $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: ");
  var $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: "); 

  $body.append($playersCards);
  $body.append($dealersCards);

  // Create hit and stay buttons
  var $hit = $('<a>').attr('class', 'btn success').text('Hit Me');
  var $stay = $('<a>').attr('class', 'btn warning').text('Stay');
  $body.append($hit);
  $body.append($stay);

  // Initialize constants to create deck
  var suits = ["heart", "club", "spade", "diamond"];
  var ranks = ["ace", "king", "2"];
  var cardPath = "/cards/";
  var deck = [];

  // Build the deck with paths to the correct images
  for (s = 0; s < suits.length; s++ ) {
    for (r = 0; r < ranks.length; r++ ) {
      var currentCard = cardPath + ranks[r] + '-' + suits[s] + '.png';
        deck.push(currentCard);
    }
  }
  /////////////////////////
  //      METHODS        //
  /////////////////////////

  // method that will get a random card from the deck and delete that card from the deck
  function drawCard(deck) {
    var randomNumber = Math.floor(Math.random() * deck.length);
    var drawnCard = deck[randomNumber];
    deck.splice(randomNumber, 1);
    return drawnCard;
  };

  // method that will determine correct value of a given card given its path
  function calcValue(card) {
    var value;
    var splitPath = card.split(/\//);
    var splitWord = splitPath[2].split(/-/);
    if (splitWord[0] == "ace") {
      value = 11
    } else if (splitWord[0] == "king") {
      value = 10
    } else if (splitWord[0] == "queen") {
      value = 10
    } else if (splitWord[0] == "jack") {
      value = 10
    }  else {
      value = parseInt(splitWord[0]);
    }
    return value
  };

  // method that will display cards onto screen and add up player's total
  function displayCardsOnScreen(hand, cardDiv) {
    for (h = 0; h < hand.length; h++) {
      var card = $('<img>').attr('src', hand[h]).attr('class', 'card-image');
      cardDiv.append(card);
      checkForBust()
    }
  }

  function addPlayerTotal(hand) {
    if (playerTotal > 0) {
      playerTotal = 0
    }
    for (h = 0; h < hand.length; h++) {
      playerTotal += calcValue(hand[h]);
      checkForBust()
    }
    return playerTotal
  }
  
  function addDealerTotal(hand) {
    if (dealerTotal > 0) {
      dealerTotal = 0
    }
    for (h = 0; h < hand.length; h++) {
      dealerTotal += calcValue(hand[h]);
      checkForBust()
    }
    return dealerTotal
  }

  function checkForBust() {
    if (playerTotal > 21) {
      $('.btn.success').remove();
      $('#hello_world').text('You Bust! Better Luck Next Time');
    }
  }

  // Create players hand and total. Draw two cards for player's hand to start off
  var playerHand = []
  var playerTotal = 0
  var dealerHand= []
  var dealerTotal = 0
  playerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));
  playerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));

  // display all the players cards onto the screen and add up total
  displayCardsOnScreen(playerHand, $playersCards);

  // add player total
  addPlayerTotal(playerHand);

  // display player total on screen
  $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);

  $playersCards.append($playersTotalScore);

  // Trigger event for hit state. Delete cards in div, add card to hand, redraw all cards
  $('.btn.success').on( "click", function() {
    $playersCards.empty(); // empty player cards div of old images
    playerHand.push(drawCard(deck)); // draw another card

    displayCardsOnScreen(playerHand, $playersCards); // display new drawn card
    addPlayerTotal(playerHand); // re-calculate total with new card

    // build the new player total H1 and display it under the cards
    $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);
    $playersCards.append($playersTotalScore);
  });


  // Trigger event for dealer to go
  $('.btn.warning').on( "click", function() {
    $('.btn.success').remove();
    $('.btn.warning').remove();
    $('#hello_world').text("You Stayed. Let's see if you win");
    displayCardsOnScreen(dealerHand, $dealersCards);
    addDealerTotal(dealerHand)
    dealerHand.push(drawCard(deck));

    $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: " + dealerTotal);
    $dealersCards.append($dealersTotalScore);

    while (dealerTotal < 16) {
      $dealersCards.empty();
      dealerHand.push(drawCard(deck));

      displayCardsOnScreen(dealerHand, $dealersCards);
      addDealerTotal(dealerHand)
    }
    console.log(playerTotal);
    console.log(dealerTotal);
  });


}); // End of JQuery Ready Statement
