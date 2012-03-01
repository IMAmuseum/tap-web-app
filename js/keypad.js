(function($){
	var $write = $('#write'),
		shift = false,
		capslock = false;
	$('#keypad div div div keybtn').click(function(){
		var $this = $(this),
			character = $this.html();

		// Delete
		if ($this.hasClass('delete')) {
			var html = $write.html();

			$write.html(html.substr(0, html.length - 1));
			return false;
		}
		// Add the character
		$write.html($write.html() + character);
	});
}(jQuery));		
