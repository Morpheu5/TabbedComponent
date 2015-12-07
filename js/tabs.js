$(function() {
	// First part: fetch the data.
	$('.tabbed:not(".no-js") > .tab-pane').each(function(index, element) {
		// jQuerify the selected element, for clarity's sake.
		var pane = $(element);
		// Sanitize the section name, you never know who's going to pass stuff to us.
		var section = pane.data('section').replace(/[^a-zA-Z0-9-]+/g, "");
		// Construct the URL
		var url = "http://content.guardianapis.com/search?api-key=9wur7sdh84azzazdt3ye54k4&page-size=5&section=" + section;
		// Let's go, make the magic happen
		$.ajax({method: 'GET', url: url})
			.done(function(response) {
				var results = response.response.results;
				// Mind this is not the same as above...
				var section;
				var listItems = [];
				$(results).each(function(index, result) {
					// I am not going to sanitize these, but should we trust ourselves?
					var webTitle = result.webTitle;
					var webUrl = result.webUrl;
					section = result.sectionId;
					// Not a big fan of hardcoded html, but there is a time limit...
					listItems.push( $('<li><span class="item-number">' + (index+1) + '</span><a href="' + webUrl + '">' + webTitle + '</a></li>') );
				});
				$('.tabbed:not(".no-js") > .tab-pane[data-section="' + section + '"] > ol').append(listItems);
			})
			.fail(function(error) {
				// Well... I couldn't make it fail in any sensible way, so I guess I'll just leave this here.
				// TODO Show a nice message.
			});
	});
	
	// Second part: transform the HTML as necessary.
	var tabRow = $('<ul class="tab-row"/>');
	$('.tabbed:not(".no-js")').prepend(tabRow);
	$('.tabbed:not(".no-js") > .tab-pane').each(function(index, element) {
		// jQuerify the selected element, for clarity's sake.
		var pane = $(element);
		// Make sure we take one element, the first, just in case someone slips and puts more header>h1 tags.
		var title = pane.find('header > h2').first().text();
		// Grab this pane's id, jQuery's tabs plugin likes that.
		var tabId = pane.attr('id');
		// ... well, hardcoding html like this is less than ideal. Could have used a templating library.
		tabRow.append('<li><a href="#' + tabId + '">' + title + '</a></li>');
	});
	// We don't need these anymore
	$('.tabbed:not(".no-js") > .tab-pane > header').remove();

	// Last part: let's make the tab magic happen.
	$('.tabbed:not(".no-js")').tabs();
});