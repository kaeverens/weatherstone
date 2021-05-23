let $img, net, classifier;
const classNames = ['Overcast', 'Sunny', 'Raining', 'Breezy', 'Wet', 'Dry'];
classifier = knnClassifier.create();
async function app() {
	let currentSrc;
	async function addExample(className) {
		$.post('/php/trainingAdd.php', {
			className:className,
			image:currentSrc
		}, r=>{
			if (r.error) {
				alert(r.error);
			}
		});
		const activation = net.infer($img[0], true);
		classifier.addExample(activation, className);
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
	$img=$('#img');
	$img.on('load', classify);
	net=await mobilenet.load();
	const $classifiers=$('#classifiers')
		.on('click', 'button', function() {
			addExample($(this).text());
		});
	if (Object.keys(training_data).length) {
		let numTrainingImages=0, trainingImages=[];
		Object.keys(training_data).forEach(k=>{
			$('<button/>').text(k).prependTo($classifiers);
			training_data[k].forEach(n=>{
				numTrainingImages++;
				trainingImages.push([k, n]);
			});
		});
		var imageAt=0;
		function trainNext() {
			var idata=trainingImages[imageAt];
			imageAt++;
			if (!idata) {
				return getNextImage();
			}
			var image=new Image();
			image.addEventListener('load', ()=>{
				const activation = net.infer(image, true);
				classifier.addExample(activation, idata[0]);
				trainNext();
			});
			image.src=idata[1];
		}
		trainNext();
	}
	else {
		$('#results').text('no training data. please use the classifier below to get it started');
		getNextImage();
	}
	$classifiers.find('input').change(function() {
		var key=$(this).val().trim();
		if (!key) {
			return;
		}
		addExample(key);
		$('<button/>').text(key).prependTo($classifiers);
		$(this).val('');
	});
}
$(()=>{
	app();
});
