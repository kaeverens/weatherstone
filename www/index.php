<!doctype html>
<html>
	<head>
		<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
		<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet"></script>
		<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/knn-classifier"></script>
		<script>
<?php
$training_data=[];
$dirs=new DirectoryIterator('../training_data');
foreach ($dirs as $dir) {
	if ($dir->isDot()) {
		continue;
	}
	$arr=[];
	$dname=$dir->getFilename();
	$dirs2=new DirectoryIterator('../training_data/'.$dname);
	foreach ($dirs2 as $dir2) {
		if ($dir2->isDot()) {
			continue;
		}
		$arr[]=base64_decode($dir2->getFilename());
	}
	$training_data[$dname]=$arr;
}
echo 'const training_data='.json_encode($training_data).';';
?>
		</script>
		<script src="js.js"></script>
	</head>
	<body>
		<h3>What the computer sees</h3>
		<img id="img"/>
		<div id="filename"></div>
		<h3>What the computer thinks it means</h3>
		<div id="results">please wait... training</div>
		<h3>If the result is incorrect, add a new classification for the image you see</h3>
		<div id="classifiers"><input placeholder="add new..."/></div>
	</body>
</html>
