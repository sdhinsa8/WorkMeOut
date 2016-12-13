//This is the logic for the client of the website, instead of having multiple javascript files it is all handles in one file

$(function() {
	//The function below gathers the information from the api about a particular excercise
	// and loads it into a modal view for the user
	$(".workoutInfo").click(function(event) {
		//get data from button
		id = event.currentTarget.href.split('/').pop();
		//clear the modal
		$('#exDescription').empty();
		$('#exPicture').empty();
		$('#myModalLabel').empty();
		$('#exCategory').empty();
		$('#exMuscles').empty();
		//Below are the calls for getting the multiple resources for an excercies from multiple endspoints
		$.ajax({
		    url: "https://wger.de/api/v2/exerciseimage/?exercise=" + id,
			//headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
		    type: 'GET',
		    success: function(result) {
				var r = ``
				 if (result.results.length == 0) {
					 r = `<h5>Illustration</h5> <p>No Image</p>`
					 $('#exPicture').append(r);
				 } else  {
				    r = `
					<h5>Illustration</h5>
					<div class="thumbnail">
				  	<img src=${result.results[0].image} >
					</div>
			  		`
					  $('#exPicture').append(r);
				 }
		      }
		  });

		  $.ajax({
		    url: "https://wger.de/api/v2/exercise/" + id,
			//headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
		    type: 'GET',
			//contentType: "application/json",
			//dataType: "json",
		    success: function(result) {
				  console.log(result);
				  $('#exDescription').append("<h5>Description</h5>"+result.description);
				  $('#myModalLabel').append(result.name);

				  $.ajax({
						url: "https://wger.de/api/v2/exercisecategory/" + result.category,
						//headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
						type: 'GET',
						success: function(result) {
							var r = `
								<h5>Category</h5>
								<p>${result.name}</p>
								`
							$('#exCategory').append(r);
						
						}
					});

					result.muscles.forEach(function(mus) {
						$.ajax({
							url: "https://wger.de/api/v2/muscle/" + mus,
							//headers: {"Authorization": "Token 28b066ae39ddd20837753c1eec2a7c5fef6362a2"},
							type: 'GET',
							success: function(result) {
							
								var r = `
									<p>${result.name}</p>
									`
								$('#exMuscles').append(r);
							}
						});

					});
		      }
		  });
		//Modal is shown
		$('#myModal').modal();
		$('#myModal').modal('show');
		event.preventDefault()
	});

	//This handles the search button , and  hits the database, and updates the table with the search results
	$(".searchButton").click(function(event) {
		//get data from form
		searchTerm = $('.searchBar').val()
		$.ajax({
		    url: "/searchTerm/" + searchTerm,
		    type: 'GET',
		    success: function(result) {
		      //delete contents of cards or rows
			  console.log(result);
			  $('.list-group').empty();
			  result.results.forEach(function(rou) {
				  var r = `
			  		<a href="/routines/show/${rou._id}" class="list-group-item list-group-item-action"> <h5 class="list-group-item-heading">${rou.name}</h5>
              		<p class="list-group-item-text">${rou.description}</p>
              		</a>
			  		`
				  $('.list-group').append(r);
			  });
		      }
		    });
		event.preventDefault();
	});

	//If a routine is delete it will reload the page to get rid d the value
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

	//handles animation for adding anew week along with its days.
	$('#addWeek').click(function(event) {
		let weekCount = $('#weeks').children().length + 1;
		createLocalStorage(weekCount - 1);//Makes sure that local storage is clear
		$('#weeks').append(createWeekButtons(weekCount));
		event.preventDefault();
		$('.weekButton').click(function(event) {
			let daySelected = event.target.id;
			$('#myModal').empty();
			$('#myModal').append(createModal(daySelected));
			$('#myModal').modal();
			$('#myModal').modal('show');
			modalRules(event);
		});
	});

	//Adds a routine.
	$("#addRoutineButton").click(function(event) {
		let weekCount = $('#weeks').children().length;
		$('<input />').attr('type', 'hidden')
          .attr('name', "weekData")
          .attr('value', localStorage.getItem("weeks"))
          .appendTo('#routineForm');

		$('<input />').attr('type', 'hidden')
          .attr('name', "weekCount")
          .attr('value', weekCount)
          .appendTo('#routineForm');
	});

	//handles logiic if the page is in edit more
	if (location.pathname.substring(0,14) === "/routines/edit") {
		//mor log for when it comes to editin using the data from  local storage
		$.ajax({
		    url: "/api" + location.pathname ,
		    type: 'GET',
		    success: function(result) {
						$("#descriptionRoutine").val(result.routine.description);
						$("#nameRoutine").val(result.routine.name);
						for (i = 1; i < result.routine.weeks.length + 1; i++) { 
								$('#weeks').append(createWeekButtons(i));
						}
						$('.weekButton').click(function(event) {
                let daySelected = event.target.id;
                $('#myModal').empty();
                $('#myModal').append(createModal(daySelected));
                $('#myModal').modal();
                $('#myModal').modal('show');
                modalRules(event);
            });
			//createLocalStorage
			createLocalStorageFromRoutine(result.routine);
		      }
		    });
		}

});

//Creates a section of buttons with days
var createWeekButtons = function(weekNumber) {
	result = `
	<div id="week${weekNumber}">
		<h4>Week ${weekNumber}</h4>
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

//Createst the select for each modal. Because it is constaly changing, it is created on the client side.
var createSelect = function(unit) {
	result = ""
	let units = ["Kilometers", "Miles", "Minutes", "Reps", "Seconds", "Failure"]
	units.forEach(function(datum){
		if (datum === unit) {
			result += `<option value="${datum}" selected="selected">${datum}</option>`;
		}
		else {
			result += `<option value="${datum}">${datum}</option>`;
		}
	});
	return result;
}

//Creates the input fields for the modal, and because it is dynamic with each day it has to be created on the client. This could be changed
//if I were using tools like React or angular.
var createInputFields = function(data) {
	endresult = "";
	data.forEach(function(datum) {
		select = createSelect(datum.unit);
		inputs = `
     <div id="${datum.id}">
				<h4 id="name${datum.id}" data-name="${datum.name}">Excercise: ${datum.name}</h4>
				<div class="form-group">
						<label>Sets</label>
						<input type="number" id="set${datum.id}" class="form-control" name="sets" value="${datum.set}">
				</div>

				<div class="form-group">
						<label>Amount</label>
						<input type="number" id="amount${datum.id}" class="form-control" name="amount" value="${datum.amount}">
				</div>

				<div class="form-group">
						<label>Unit</label>
						<select class="form-control" id="unit${datum.id}" name="unit">
							${select}
						</select>
				</div>
			</div>
		`
		endresult += inputs;
	});
	return endresult;
}

//Created the modeal regardless of edit or new
var createModal = function(id) {
	let weeks = {"sun": "Sunday", "mon": "Monday", "tus": "Tusday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday", "sat": "Saturday"};
	let dayOfWeek = weeks[id.substring(0, 3)];
	let weekNumber = id.substring(3, 4);
	let data = checkIfDataExists(weekNumber,dayOfWeek);
	var fields = "";
	//if exiting fileds exists it will make sure to create the form with existing data
	if (data) {
		fields = createInputFields(data);
	} 
	result =`
	<div class="modal-dialog modal-lg">
					<div class="modal-content">

							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="currentDate" data-dayweek="${id}" class="modal-title">${dayOfWeek} of Week ${weekNumber}</h4>
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
									${fields}
								</div>
							</form>

							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-success saveDay">Save Day</button>
								<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							</div>
					</div>
		</div>
	`
	return result
}

//Checks if there is anything stored locally
var checkIfDataExists = function(weekNumber,dayOfWeek) {
	var storage = JSON.parse(localStorage.getItem("weeks"));

	if (weekNumber in storage) {
		if (storage[weekNumber][dayOfWeek].length > 0 ) {
			return storage[weekNumber][dayOfWeek];
		}
	} 
	return false
}


//main rules for the app to follow
modalRules = function(event) {
	queryWhenTyped(event);
	addExcerciseButton(event);
	saveDayButton();
}

//query rule for making autocomplete
var queryWhenTyped = function(event) {
	$('#searchEx').on('input',function(event) {
			//after two letters with the help of the api it will craete autocomplete
			if (event.currentTarget.value.length > 2) {
				queryForTerms(event.currentTarget.value);
			}
	});
}

// This is the logic for the add excercise button in the modal view
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

//If the add excercise button is clicked this creates the form for each excercise
var addExcerciseForm = function(excerciseOb) {

	result = `
	<div id="${excerciseOb.id}">
		<h4 id="name${excerciseOb.id}" data-name="${excerciseOb.name}">Excercise: ${excerciseOb.name}</h4>
		<div class="form-group">
				<label>Sets</label>
				<input type="number" id="set${excerciseOb.id}" class="form-control" name="sets">
    </div>

		<div class="form-group">
				<label>Amount</label>
				<input type="number" id="amount${excerciseOb.id}" class="form-control" name="amount">
    </div>
		<div class="form-group">
				<label>Unit</label>
				<select class="form-control" id="unit${excerciseOb.id}" name="unit">
					<option value="Kilometers">Kilometers</option>
					<option value="Miles">Miles</option>
					<option value="Minutes">Minutes</option>
					<option value="Reps" selected="selected">Reps</option>
					<option value="Seconds">Seconds</option>
					<option value="Failure">Failure</option>
				</select>
    </div>
	</div>
	`
	return result
}

//Saves an independent day locally
var saveDayButton = function() {
	$(".saveDay").click(function(event) {
		clearDay();
		$('#excerciseList').children().each(function(index, value){
			var rexID = this.id;
			if (rexID) {
				let rname = $('#name'+ rexID).data('name');
				var rset = $('#set' + rexID).val();
				var ramount = $('#amount' + rexID).val();
				var runit = $('#unit' + rexID).val();
				storing = {id: rexID, name: rname, set: rset, amount: ramount, unit: runit, order: index};
				storeADayLocally(storing);
			}
		});
		$('#myModal').modal('hide');
		event.preventDefault();
	});
}

//saves the data locally 
var createLocalStorage = function(weekCount) {
	if(weekCount == 0) {
		localStorage.setItem("weeks", JSON.stringify({}))
	}
}

//if it is a new form before editing it or creating it it makes sure there is no history
var clearDay = function() {
	let id = $('#currentDate').data('dayweek');
	let weeks = {"sun": "Sunday", "mon": "Monday", "tus": "Tusday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday", "sat": "Saturday"};
	let dayOfWeek = weeks[id.substring(0, 3)];
	let weekNumber = id.substring(3, 4);

	var storage = JSON.parse(localStorage.getItem("weeks"));

	if (!(weekNumber in storage)) {
		storage[weekNumber] = {"Sunday": [], "Monday": [], "Tusday": [], "Wednesday": [], "Thursday": [],  "Friday": [],  "Saturday": []};
	}
	storage[weekNumber][dayOfWeek] = [];
	localStorage.setItem('weeks', JSON.stringify(storage));
}

//Stores a scpecific day locally in the database
var storeADayLocally = function(storing) {
	let id = $('#currentDate').data('dayweek');
	let weeks = {"sun": "Sunday", "mon": "Monday", "tus": "Tusday", "wed": "Wednesday", "thu": "Thursday", "fri": "Friday", "sat": "Saturday"};
	let dayOfWeek = weeks[id.substring(0, 3)];
	let weekNumber = id.substring(3, 4);

	var storage = JSON.parse(localStorage.getItem("weeks"));

	if (!(weekNumber in storage)) {
		storage[weekNumber] = {"Sunday": [], "Monday": [], "Tusday": [], "Wednesday": [], "Thursday": [],  "Friday": [],  "Saturday": []};
	}
	storage[weekNumber][dayOfWeek].push(storing);
	localStorage.setItem('weeks', JSON.stringify(storage));
}

//Once everything is in place it creates the overall routine in localstorage
var createLocalStorageFromRoutine = function(routine) {
	finalObject = {};
	let totalWeeks = routine.weeks.length;
	for (i = 1; i < routine.weeks.length + 1; i++) { 
		sun = routine.weeks[i - 1].sunday;
		sunData = [];
		sun.forEach(function(workout) {
			sunData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		mon = routine.weeks[i - 1].monday;
		monData = [];
		mon.forEach(function(workout) {
			monData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		tus = routine.weeks[i - 1].tusday;
		tusData = [];
		tus.forEach(function(workout) {
			tusData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		wed = routine.weeks[i - 1].wednesday;
		wedData = [];
		wed.forEach(function(workout) {
			wedData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		thu = routine.weeks[i - 1].thursday;
		thuData = [];
		thu.forEach(function(workout) {
			thuData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		fri = routine.weeks[i - 1].friday;
		friData = [];
		fri.forEach(function(workout) {
			friData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		sat = routine.weeks[i - 1].saturday;
		satData = [];
		sat.forEach(function(workout) {
			satData.push({id: workout.workoutID, name: workout.workoutName, set: workout.sets, amount: workout.amount, unit: workout.unit, order: workout.order});
		});

		finalObject[i] = {"Sunday": sunData, "Monday": monData, "Tusday": tusData, "Wednesday": wedData, "Thursday": thuData,  "Friday": friData,  "Saturday": satData};
	}

	localStorage.setItem("weeks", JSON.stringify(finalObject));

}
