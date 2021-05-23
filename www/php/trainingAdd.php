<?php
$className=trim($_REQUEST['className']??'');
header('Content-type: text/json');
if ($className===''
	|| preg_replace('/[A-Za-z]/', '', $className)!==''
) {
	die(json_encode(['error'=>'hack off']));
}
$image=trim($_REQUEST['image']);
if (strlen($_REQUEST['image'])>64) {
	die(json_encode(['error'=>'image URL unexpectedly long']));
}
@mkdir('../../training_data/'.$className);
if (!touch('../../training_data/'.$className.'/'.base64_encode($image))) {
	die(json_encode(['error'=>'failed to record data point - check directory permissions']));
}
echo json_encode(['ok'=>'1']);
