let $img, net, classifier;
const classNames = ['Overcast', 'Sunny', 'Raining', 'Breezy', 'Wet', 'Dry'];
classifier = knnClassifier.create();
async function app() {
	let currentSrc;
	function getNextImage() {
		$.post('/php/image-get.php', r=>{
			$('#filename').text(r.url);
			currentSrc=r.url;
			$img.attr('src', r.url);
		});
	}
	function showResults(result) {
		var $table=$('<table class="results"><tbody/></table>');
		Object.keys(result.confidences).forEach(k=>{
			var $tr=$('<tr><td class="confidence"/><td class="label"/></tr>');
			$tr.find('.confidence').text((result.confidences[k]*100).toFixed(2)+'%');
			$tr.find('.label').text(k);
			$tr.appendTo($table.find('tbody'));
		});
		$('#results').empty().append($table);
	}
	async function classify() {
    if (classifier.getNumClasses() > 0) {
      const img = $img[0];

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const results = await classifier.predictClass(activation);
			showResults(results);
      // Dispose the tensor to release the memory.
    }
		setTimeout(getNextImage, 10000);
	}
	$img=$('#img');
	$img.on('load', classify);
	net=await mobilenet.load();
	getNextImage();
	const $classifiers=$('#classifiers')
		.on('click', 'button', function() {
			addExample($(this).text());
		});
	for (let i=0;i<classNames.length;++i) {
		$('<button data-idx="'+i+'"/>').text(classNames[i]).appendTo($classifiers);
	}
	async function addExample(className) {
		const activation = net.infer($img[0], true);
		$.post('/php/trainingAdd.php', {
			className:className,
			image:currentSrc
		}, r=>{
			console.log(r);
			if (r.error) {
				alert(r.error);
			}
		});
		classifier.addExample(activation, className);
	}
}
$(()=>{
	app();
});
