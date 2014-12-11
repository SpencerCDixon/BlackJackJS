$(function() {
  /////////////////////////
  //  SET UP THE WEBPAGE //
  /////////////////////////

  // Grab the body and add two containers for the cards also make container darker color to see cards
  var $body = $("#container");
  $body.addClass('black-background');
  var $playersCards = $('<div>').attr('id', 'players_cards');
  var $dealersCards = $('<div>').attr('id', 'dealers_card');
  var $controls = $('<p>').attr('id', 'controls').addClass('bottom');
  var $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: ");
  var $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: "); 

  // Will be used to incorporate betting
  var $chipCounts = $('<div>').attr('id', 'chip_count');
  var playersTotalChips = 0
  var $playersChips = $('<p>').attr('id', 'player_chips').addClass('player_chips').text("Player's Chips: " + playersTotalChips); 

  $body.append($playersCards);
  $body.append($dealersCards);
  $body.append($controls);
  $body.append($chipCounts);
  $chipCounts.append($playersChips);

  // Create hit and stay buttons
  var $hit = $('<a>').attr('class', 'btn danger').text('Hit Me');
  var $stay = $('<a>').attr('class', 'btn info').attr('id', 'stay').text('Stay');
  $controls.append($hit);
  $controls.append($stay);

  // Initialize constants to create deck
  var suits = ["heart", "club", "spade", "diamond"];
  var ranks = ["ace", "king", "queen", "jack", "2", "3", "4", "5", "6", "7", "8", "9", "ace", "king", "queen", "jack", "2", "3", "4", "5", "6", "7", "8", "9"]; 
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

  // Method that will get a random card from the deck and delete that card from the deck
  function drawCard(deck) {
    var randomNumber = Math.floor(Math.random() * deck.length);
    var drawnCard = deck[randomNumber];
    deck.splice(randomNumber, 1);
    return drawnCard;
  };

  // Method that will determine correct value of a given card given its path
  function calcValue(card) {
    var value;
    var splitPath = card.split(/\//);
    var splitWord = splitPath[2].split(/-/);
    // Hard coded ace in for now
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

  // Method that will display cards onto screen and add up player's total
  function displayCardsOnScreen(hand, cardDiv) {
    for (h = 0; h < hand.length; h++) {
      var $card = $('<img>').attr('src', hand[h]).attr('class', 'card-image');
      cardDiv.append($card);
      checkForBust();
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

  function makePlayAgain() {
    // put the play button onto the screen
    var $replay = $('<a>').attr('class', 'btn info').attr('id', 'play').text('Play Again');
    $controls.append($replay);

    // reset the cards for a new round
    $('#play').on( "click", function() {
      // for betting
      $chipCounts.empty();
      var $playersChips = $('<p>').attr('id', 'player_chips').addClass('chips').text("Player's Chips: " + playersTotalChips); 
      $chipCounts.append($playersChips);

      $('#hello_world').text("Lets play blackjack!");
      $('#play').remove();
      $controls.append($hit);
      $controls.append($stay);

      $playersCards.empty();
      $dealersCards.empty();


      // reset hands and totals for new round
      playerHand = []
      playerTotal = 0
      dealerHand = []
      dealerTotal = 0

      // Draw two cards for each hand to start off
       playerHand.push(drawCard(deck));
       dealerHand.push(drawCard(deck));
       playerHand.push(drawCard(deck));
       dealerHand.push(drawCard(deck));


       displayCardsOnScreen(playerHand, $playersCards);


      // Add player total
       addPlayerTotal(playerHand);

      // Display player total on screen
      $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);
      $playersCards.append($playersTotalScore);

      // Display one of computers cards on screen
      var faceUpCard = [dealerHand[0]]
      displayCardsOnScreen(faceUpCard, $dealersCards); 

      $('.btn.danger').on( "click", function() {
        $playersCards.empty(); // empty player cards div of old images
        playerHand.push(drawCard(deck)); // draw another card

        displayCardsOnScreen(playerHand, $playersCards); // display new drawn card
        addPlayerTotal(playerHand); // re-calculate total with new card

        // Build the new player total H1 and display it under the cards
        $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);
        $playersCards.append($playersTotalScore);
      });

      $('#stay').on( "click", function() {
        $dealersCards.empty();
        $('.btn.danger').remove();
        $('.btn.info').remove();
        $('#hello_world').text("You Stayed. Let's see if you win");
        displayCardsOnScreen(dealerHand, $dealersCards);
        addDealerTotal(dealerHand)

        $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: " + dealerTotal);
        $dealersCards.append($dealersTotalScore);

        while (dealerTotal < 16 && dealerTotal <= 21) {
          $dealersCards.empty();
          dealerHand.push(drawCard(deck));

          displayCardsOnScreen(dealerHand, $dealersCards);
          addDealerTotal(dealerHand)

        // Make sure dealer score is being displayed after every draw
          $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: " + dealerTotal);
          $dealersCards.append($dealersTotalScore);
        }
        checkForWinner(playerTotal, dealerTotal); // Find winner of the round

        // change chip counts if won
        $chipCounts.empty();
        var $playersChips = $('<p>').attr('id', 'player_chips').addClass('chips').text("Player's Chips: " + playersTotalChips); 
        $chipCounts.append($playersChips);
      }); 
    });



  };
  function checkForBust() {
    if (playerTotal > 21) {
      $('.btn.danger').remove();
      $('.btn.info').remove();
      $('#hello_world').text('You Bust! Better Luck Next Time. Refresh to play again.');
      makePlayAgain();
    }
  }

  function checkForWinner(playerHand, dealerHand) {
    makePlayAgain();
    if (playerHand <= 21 && dealerHand > 21) {
      $('#hello_world').text('Player Wins! Great Job!');
      playersTotalChips += 10
    } else if (dealerHand > 21) {
      playersTotalChips += 10
      $('#hello_world').text('Player Wins! Great Job!');
    } else if (playerHand <= 21 && playerHand > dealerHand && dealerHand <= 21) {
      playersTotalChips += 10
      $('#hello_world').text('Player Wins! Great Job!');
    } else {
      $('#hello_world').text('Computer Wins! Try harder next time... ');
    }
  }
  /////////////////////////
  //      GAME PLAY      //
  /////////////////////////

  // Create player & computer hand. Draw two cards for each hand to start off
  var playerHand = []
  var playerTotal = 0
  var dealerHand= []
  var dealerTotal = 0
  playerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));
  playerHand.push(drawCard(deck));
  dealerHand.push(drawCard(deck));

  // Display all the players cards onto the screen and add up total
  displayCardsOnScreen(playerHand, $playersCards);

  // Add player total
  addPlayerTotal(playerHand);

  // Display player total on screen
  $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);
  $playersCards.append($playersTotalScore);

  // Display one of computers cards on screen
  var faceUpCard = [dealerHand[0]];
  displayCardsOnScreen(faceUpCard, $dealersCards);

  // Trigger event for hit state. Delete cards in div, add card to hand, redraw all cards
  $('.btn.danger').on( "click", function() {
    $playersCards.empty(); // empty player cards div of old images
    playerHand.push(drawCard(deck)); // draw another card

    displayCardsOnScreen(playerHand, $playersCards); // display new drawn card
    addPlayerTotal(playerHand); // re-calculate total with new card

    // Build the new player total H1 and display it under the cards
    $playersTotalScore = $('<h1>').attr('id', 'players_score').text("Player Score: " + playerTotal);
    $playersCards.append($playersTotalScore);
  });


  // Trigger event for dealer to go
  $('#stay').on( "click", function() {
    $dealersCards.empty();
    $('.btn.danger').remove();
    $('.btn.info').remove();
    $('#hello_world').text("You Stayed. Let's see if you win");
    displayCardsOnScreen(dealerHand, $dealersCards);
    addDealerTotal(dealerHand)

    $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: " + dealerTotal);
    $dealersCards.append($dealersTotalScore);

    while (dealerTotal < 16 && dealerTotal <= 21) {
      $dealersCards.empty();
      dealerHand.push(drawCard(deck));

      displayCardsOnScreen(dealerHand, $dealersCards);
      addDealerTotal(dealerHand)

    // Make sure dealer score is being displayed after every draw
      $dealersTotalScore = $('<h1>').attr('id', 'dealers_score').text("Dealer Score: " + dealerTotal);
      $dealersCards.append($dealersTotalScore);
    }
    checkForWinner(playerTotal, dealerTotal); // Find winner of the round
    $chipCounts.empty();
    var $playersChips = $('<p>').attr('id', 'player_chips').addClass('chips').text("Player's Chips: " + playersTotalChips); 
    $chipCounts.append($playersChips);
  });


}); // End of JQuery Ready Statement
