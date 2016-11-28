$(function() {
    $(".deleteUserRoutines").click(function(event) {
		$.ajax({
		    url: event.currentTarget.href,
		    type: 'DELETE',
		    success: function(result) {
		      location.reload();
		      }
		    });
		event.preventDefault();
	});

});