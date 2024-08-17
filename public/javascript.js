//****************  index page code    **************************/
$(document).ready(function(){
	// Add minus icon for collapse element which is open by default
	$(".collapse.show").each(function(){
		$(this).siblings(".card-header").find(".btn i").html("remove");
	});
	
	// Toggle plus minus icon on show hide of collapse element
	$(".collapse").on('show.bs.collapse', function(){
		$(this).parent().find(".card-header .btn i").html("remove");
	}).on('hide.bs.collapse', function(){
		$(this).parent().find(".card-header .btn i").html("add");
	});


    // Sidebar item
    $('.sidebar-item').click(function(e){
        e.preventDefault();
        var target = $(this).data('target');
        var content = $(this).data('content');
        $(target).html(content);
    });

     // Style Alteration
     $('#change-color-scheme').click(function(e){
        e.preventDefault();
        $('body').css({
            'background-color': '#343a40',
            'color': '#f8f9fa'
        });
        $('.card').css('background-color', '#495057');
        $('.card-body').css('color', '#f8f9fa');
    });

    // Element Creation
    $('#addItem').click(function() {
        var newItem = $('<a href="#" class="list-group-item list-group-item-action sidebar-item">New Item</a>');
        newItem.attr('data-target', '#cardBodyOne');
        newItem.attr('data-content', "<h5 class='mt-0'>New Title</h5><p>New content for the new item.</p>");
        $('#sidebar').append(newItem);
    });

    // Element Deletion
    $('#removeItem').click(function() {
        $('#sidebar a.sidebar-item:last').remove();
    });

});

    // **************  dashboard code   ************//
    $('#editSearchedMovie').on('click', function() {
        const movieTitle = $('#movieSearch').val().trim();
        if (!movieTitle) {
            alert('Please enter a movie title to search.');
            return;
        }
    
        const button = $(this);
    
        if (button.text() === 'Edit') {
            $.ajax({
                url: '/search-movie',
                method: 'GET',
                data: { title: movieTitle },
                success: function(movie) {
                    if (movie) {
                        currentEditingMovie = movie;
                        const row = $(`tr[data-id="${movie.id}"]`);
                        row.find('.editable').attr('contenteditable', true).addClass('editing');
                        button.text('Save');
                    } else {
                        alert('Movie not found.');
                    }
                },
                error: function() {
                    alert('Movie not found.');
                }
            });
        } else {  //editing movie details
            if (currentEditingMovie) {
                const row = $(`tr[data-id="${currentEditingMovie.id}"]`);
                const updatedData = {};
                row.find('.editable').each(function() {
                    updatedData[$(this).data('field')] = $(this).text();
                });
    
                $.ajax({
                    url: '/update-movie/' + currentEditingMovie.id,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(updatedData),
                    success: function() {
                        alert('Movie updated successfully');
                        row.find('.editable').attr('contenteditable', false).removeClass('editing');
                        button.text('Edit');
                        currentEditingMovie = null;
                    },
                    error: function() {
                        alert('Error updating movie');
                    }
                });
            }
        }
    });
    
        // delete movie from database
    $('#deleteSearchedMovie').on('click', function() {
        const movieTitle = $('#movieSearch').val().trim();
        if (!movieTitle) {
            alert('Please enter a movie title to delete.');
            return;
        }
    
        if (confirm('Are you sure you want to delete this movie?')) {
            $.ajax({
                url: '/delete-movie-by-title',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ title: movieTitle }),
                success: function() {
                    alert('Movie deleted successfully');
                    $(`tr:contains("${movieTitle}")`).remove();
                    $('#movieSearch').val('');
                },
                error: function() {
                    alert('Error deleting movie');
                }
            });
        }
    });

    //********** Movie Form js to insert data into db ******************/
    document.getElementById('movieForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const movieData = Object.fromEntries(formData.entries());
    
        fetch('/insert-movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Movie added successfully!');
                this.reset();
                refreshMovieTable();
            } else {
                alert('Error adding movie: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the movie.');
        });
    });
    
    function refreshMovieTable() {
        fetch('/get-movies')
            .then(response => response.json())
            .then(movies => {
                const tableBody = document.getElementById('movieTableBody');
                tableBody.innerHTML = '';
                movies.forEach((movie, index) => {
                    const row = `
                        <tr data-id="${movie.id}">
                            <td>${index + 1}</td>
                            <td><span class="editable" data-field="title">${movie.title}</span></td>
                            <td><span class="editable" data-field="summary">${movie.summary}</span></td>
                            <td><span class="editable" data-field="year">${movie.year}</span></td>
                            <td><span class="editable" data-field="alttext">${movie.alttext}</span></td>
                            <td>
                                <img src="${movie.poster}" alt="${movie.alttext}" width="50">
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error refreshing movie table:', error);
            });
    }