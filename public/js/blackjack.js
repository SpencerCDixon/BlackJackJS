$(function() {
  // grab the body and add two containers for the cards
  var $body = $("#container");
  $body.addClass('black-background');
  var $card1 = $('<div>').attr('id', 'card1');
  var $card2 = $('<div>').attr('id', 'card2');

  $body.append($card1);
  $body.append($card2);

  var $hit = $('<a>').attr('class', 'btn success').text('Hit Me');
  var $stay = $('<a>').attr('class', 'btn warning').text('Stay');

  $body.append($hit);
  $body.append($stay);

  var suits = ["heart", "club", "spade", "diamond"]
  var ranks = ["ace"]
  var cardPath = "/cards/"
  var deck = []

  // Build the deck with paths to the correct images
  for (i = 0; i < suits.length; i++ ) {
    var currentCard = cardPath + ranks[0] + '-' + suits[i] + '.png';
      deck.push(currentCard);
  }

  // Attempt at making a method that will get a random card from the deck and delete that card from the deck
  function drawCard(deck) {
    var randomNumber = Math.floor(Math.random() * deck.length);
    var drawnCard = deck[randomNumber]
    deck.splice(randomNumber, 1)
    return drawnCard
  };
  console.log(deck);
  console.log(drawCard(deck));
  console.log(deck);


  // Get random card from the deck and display it on the screen for the user
  var randomCardOne = $('<img>').attr('src', deck[0]);
  var randomCardTwo = $('<img>').attr('src', deck[1]);
  $body.append(randomCardOne);
  $body.append(randomCardTwo);



});
