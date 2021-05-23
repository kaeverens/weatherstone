let $img, net;
async function app() {
	function getNextImage() {
		$.post('/php/image-get.php', r=>{
			$('#filename').text(r.url);
			$img.attr('src', r.url);
		});
	}
	function showResults(results) {
	console.log(results);
		var $table=$('<table class="results"><tbody/></table>');
		results.forEach(result=>{
			var $tr=$('<tr><td class="confidence"/><td class="label"/></tr>');
			$tr.find('.confidence').text((result.probability*100).toFixed(2)+'%');
			$tr.find('.label').text(result.className);
			$tr.appendTo($table.find('tbody'));
		});
		$('#results').empty().append($table);
	}
	async function classify() {
		const results=await net.classify($img[0]);
		showResults(results);
		setTimeout(getNextImage, 60000);
	}
	$img=$('#img');
	$img.on('load', classify);
	net=await mobilenet.load();
	getNextImage();
}

$(()=>{
	app();
});
