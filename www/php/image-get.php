<?php
$ls='/images/'.trim(`ls ../images/ -tr | tail -1`);
header('Content-type: text/json');
echo json_encode([
	'url'=>$ls
]);
