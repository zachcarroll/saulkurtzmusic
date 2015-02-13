$(document).ready(function() {

	// Mailchimp Signup Form:
	$('#mc-form').ajaxChimp({
		url: 'http://saulkurtz.us8.list-manage.com/subscribe/post?u=5c947129ab32ddbe6988d6d27&amp;id=55983674db'
	});

	// ---------------------------------------------------------------------
	// ----------- Soundcloud API ------------------------------------------
	// ---------------------------------------------------------------------

	// Initialize Soundcloud SDK:
	SC.initialize({
		client_id: "b399b7964d68677699dc15de44c48128"
	});

	// Get Sauls album:
 	SC.get('http://api.soundcloud.com/playlists/29204533', function(playlist) {

 		// create divs for each track in the album:
 		var tracks = playlist.tracks;

 		for(i = 0; i < tracks.length; i ++) {
 			$('#track_holder').append("<div class='track_name blue2' id='" + tracks[i].id + "'>" + tracks[i].title + "</div>");
	 		// load a waveform in as a placeholder:
 		};
 	});

	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};


	var loadSong = debounce(function (event) {
		var target = event.target || event.srcElement;
		var class_name = $(target).attr('class');
		if ( class_name == 'track_name blue2' ) {
			$(target).css({
				'background-color' : 'whitesmoke',
				color : '#333'
			});
			$(".track_name").not(target).animate({
				backgroundColor: jQuery.Color( "rgba(73, 120, 163, 0.75)" ),
				color: "whitesmoke"
			}, 200 );
			if (window.exampleStream) {
				window.exampleStream.destruct();
				$('#waveform').empty();
			}
			var id = $(target).attr('id');
			SC.get("http://api.soundcloud.com/tracks/" + id, function(track){
				waveform = new Waveform({
					container: document.getElementById("waveform"),
					innerColor: "#B57E53",
					height: 80
/* 					outerColor: "#333" */
				});

				waveform.dataFromSoundCloudTrack(track);

				var streamOptions = waveform.optionsForSyncedStream();

				SC.stream(track.uri, streamOptions, function(stream){
					window.exampleStream = stream;
				});

				window.exampleStream.play();
			});
		}
	}, 250);

 	// on clicking a track name
 	// load the waveform and track
	$('#track_holder').click(loadSong);


	// Play/Pause Button:
	$('#play').on('click', function(){
		if ( window.exampleStream.playState == 0 || window.exampleStream.paused ) {
			window.exampleStream.play();
		}
		else {
			window.exampleStream.pause();
		}
	});

	// ---------------------------------------------------------------------
	// ---------------------------------------------------------------------

	// show clicked link content and hide all other content and reset thumbnail image opacity
	$('.home').on('click', function(){
		if ( $('.homeContainer').is(":hidden") ) {
			$('.videosContainer').fadeOut('fast');
			$('.musicContainer').fadeOut('fast');
			$('.photosContainer').fadeOut('fast');
			$('.homeContainer').delay(250).fadeIn('fast');
			$('.homescreen_social_icons_container').fadeIn('fast');
			$('.thumbnails').fadeTo('fast', 0);
			$('.item').fadeTo('fast', 0);
		}
	});

	$('.music').on('click', function(){
		if ( $('.musicContainer').is(":hidden") ) {
			$('.videosContainer').fadeOut('fast');
			$('.homescreen_social_icons_container').fadeOut('fast');
			$('.homeContainer').fadeOut('fast');
			$('.photosContainer').fadeOut('fast');
			$('.musicContainer').delay(250).fadeIn('fast');
			$('.thumbnails').fadeTo('fast', 0);
			$('.item').fadeTo('fast', 0);
		}
	});

	$('.photos').on('click', function(){
		if ( $('.photosContainer').is(":hidden") ) {
			$('.videosContainer').fadeOut('fast');
			$('.homescreen_social_icons_container').fadeOut('fast');
			$('.homeContainer').fadeOut('fast');
			$('.musicContainer').fadeOut('fast');
			$('.photosContainer').delay(250).fadeIn('fast');
		}
	});

	$('.videos').on('click', function(){
		if ( $('.videosContainer').is(":hidden") ) {
			$('.photosContainer').fadeOut('fast');
			$('.homescreen_social_icons_container').fadeOut('fast');
			$('.homeContainer').fadeOut('fast');
			$('.musicContainer').fadeOut('fast');
			$('.videosContainer').delay(250).fadeIn('fast');
		}
	});

	// dynamically insert 'Photography by...' for each photo when lightbox is opened
	$('.thumbnails').on('click', function(){
		if( $(event.target).hasClass('viola') ) {
			$('.lb-number').css("display", "block");
		}
	});

	// initialize masonry
	$('#container').masonry({
		columnWidth: 100,
		itemSelector: '.item',
		gutter: 5,
		isFitWidth: true
	}).imagesLoaded(function() {
		$('#container').masonry('reloadItems');
	});

	var getRandomArbitrary = function(min, max) {
		return Math.random() * (max - min) + min;
	};

	// animate opacity for thumbnails
	$('.photos').on('click', function(){
		$('.thumbnails').each(function() {
			$(this).add( $(this).parent().parent() ).delay( getRandomArbitrary(50, 1000) ).animate( {opacity: 1}, 1000 );
			$(this).delay( getRandomArbitrary(50, 1000) ).animate( {opacity: 0.8}, 1000 );
		});
	});

	// thumbanil mouseover animations
	$('.thumbnails').on('mouseenter', function(){
		$(this).animate( {opacity: 1}, 200);
	});

	$('.thumbnails').on('mouseleave', function(){
		$(this).animate( {opacity: .8}, 200);
	});

});
