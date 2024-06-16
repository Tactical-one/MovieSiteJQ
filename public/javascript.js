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

