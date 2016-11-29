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


	$('#addWeek').click(function(event) {
		let weekCount = $('#weeks').children().length + 1;
		$('#weeks').append(createWeekButtons(weekCount));
		event.preventDefault();
		$('.weekButton').click(function(event) {
			let daySelected = event.target.id;
			$('#myModal').empty();
			$('#myModal').append(createModal(daySelected));
			$('#myModal').modal();
			$('#myModal').modal('show');

			modalRules(event)
		});
	});



});

//Creates a section of buttons with days
var createWeekButtons = function(weekNumber) {
	result = `
	<div id="week${weekNumber}">
		<button type="button" id="sun${weekNumber}" class="btn btn-primary weekButton">Sunday</button>
		<button type="button" id="mon${weekNumber}" class="btn btn-primary weekButton">Monday</button>
		<button type="button" id="tus${weekNumber}" class="btn btn-primary weekButton">Tusday</button>
		<button type="button" id="wed${weekNumber}" class="btn btn-primary weekButton">Wednesday</button>
		<button type="button" id="thu${weekNumber}" class="btn btn-primary weekButton">Thursday</button>
		<button type="button" id="fri${weekNumber}" class="btn btn-primary weekButton">Friday</button>
		<button type="button" id="sat${weekNumber}" class="btn btn-primary weekButton">Saturday</button>
	</div>
	`
	return result

}


//Using the api it gets a number of excercises for the search result, and adds it to the autocomplete
var queryForTerms = function(term) {
	$.ajax({
		    url: "https://wger.de/api/v2/exercise/search/?language=2&term=" + term,
		    type: 'GET',
		    success: function(result) {

					let data = []
					result.suggestions.forEach(function(ex) {
							data.push(ex.data.name);
					});

					$('#searchEx').autocomplete({
						source: data,
					});
		    }
	});
};


var createModal = function(id) {
	let weeks = {"sun": "Sunday", "mon": "Monday", "tus": "Tusday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday", "sat": "Saturday"};
	let dayOfWeek = weeks[id.substring(0, 3)];
	let weekNumber = id.substring(3, 4);
	console.log(dayOfWeek);
	result =`
	<div class="modal-dialog modal-lg">
					<div class="modal-content">
							<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">${dayOfWeek} of Week ${weekNumber}</h4>
							</div>
							<div class="modal-body">
							
							<form>
								<div class="form-group">
											<label>Excercises</label>
											<input type="text" class="form-control" id="searchEx" name="excercises">
											<button type="submit" class="btn btn-default addExcercise">Add Excercise</button>
                </div>
							</form>

							<form>
								<div id="excerciseList">
								</div>
							</form>

							</div>
							<div class="modal-footer">
							<button type="submit" class="btn btn-success" data-dismiss="modal">Save Day</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							</div>
					</div>
		</div>
	`
	return result
}


//Modal Rules and Methods

//main rules
modalRules = function(event) {
	queryWhenTyped(event);
	addExcerciseButton(event);


}

//query rule for making autocomplete
var queryWhenTyped = function(event) {
	$('#searchEx').on('input',function(event) {
			if (event.currentTarget.value.length > 3) {
				queryForTerms(event.currentTarget.value);
			}
	});
}

var addExcerciseButton = function(event) {
	$(".addExcercise").click(function(event) {
		let excercise = $('#searchEx').val()
		if (excercise.length > 0) {
			$.ajax({
						url: "https://wger.de/api/v2/exercise/?language=2&name=" + excercise,
						headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
						type: 'GET',
						success: function(result) {
							if (result.results.length > 0) {
								$('#excerciseList').append(addExcerciseForm(result.results[0]));
							}
						}
			});
		}
		event.preventDefault();
	});
}

// $.ajax({
// 		    url: "https://wger.de/api/v2/exercise/?language=2&name=" + "Crunches With Legs Up",
// 				headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
// 		    type: 'GET',
// 		    success: function(result) {
// 					if (result.results.length > 0) {
// 						//$('#excerciseList').append(addExcerciseForm(excerciseOb));
// 					}
// 		    }
// 	});


var addExcerciseForm = function(excerciseOb) {

	result = `
	<div data-excerciseID="${excerciseOb.id}">
		<h4>Excercise: ${excerciseOb.name}</h4>
		<div class="form-group">
				<label>Sets</label>
				<input type="number" class="form-control" name="sets">
    </div>

		<div class="form-group">
				<label>Amount</label>
				<input type="number"  class="form-control" name="amount">
    </div>
		<div class="form-group">
				<label>Unit</label>
				<select class="form-control" name="unit">
					<option value="Kilometers">Kilometers</option>
					<option value="Miles">Miles</option>
					<option value="Minutes">Minutes</option>
					<option value="Reps" selected="selected">Reps</option>
					<option value="Seconds">Seconds</option>
					<option value="Failure">Until Failure</option>
				</select>
    </div>
	<div>
	`
	return result
}