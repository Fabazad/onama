$(document).ready(function(){
  $('.parallax').parallax();
  $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '20%', // Ending top style attribute
        width: '40%'
      }
    );


  $('#nav-mobile').click(function(){
    $('.button-collapse').sideNav('hide');
  });

  $(".button-collapse").sideNav();

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 200 // Creates a dropdown of 15 years to control year
  });
  $('#nav-mobile').click(function(){
    $('.button-collapse').sideNav('hide');
  });

});

$("#myfood").hover(function(){
  $('.tooltipped').tooltip({delay: 25, html: true});
  $('.modal').modal();
  $('#inputModal').focus();


  $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '20%', // Ending top style attribute
    }
  );
});

$("#addFormButton").click(function(){
  $('select').material_select();
  $('input#input_text, textarea#textarea1').characterCounter();
});


$(document).hover(function(){
  $('.tooltipped').tooltip({delay: 50});
});

$(".collapsible").hover(function(){
  $('.collapsible').collapsible();
});

$('a[href^="#"]').click(function(){
	var the_id = $(this).attr("href");

	$('html, body').animate({
		scrollTop:$(the_id).offset().top
	}, 'slow');
	return false;
});
