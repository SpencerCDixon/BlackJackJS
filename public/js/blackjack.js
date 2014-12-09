$(function() {
  // grab the body and add two containers for the cards
  var $body = $("#container");
  var $card1 = $('<div>').attr('id', 'card1');
  var $card2 = $('<div>').attr('id', 'card2');

  $body.append($card1);
  $body.append($card2);


  var $hit = $('<a>').attr('class', 'btn success').text('Hit Me');
  var $stay = $('<a>').attr('class', 'btn warning').text('Stay');


  $body.append($hit);
  $body.append($stay);


});
