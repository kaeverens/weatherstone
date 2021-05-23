#!/bin/bash

FS_BRIGHT=34
FS_CONT=0
FNAME=www/images/`date +"%Y%m%d%H%M%S"`.png

fswebcam --quiet -d v4l2:/dev/video0 --no-banner \
	-F 1 -S 200 --png 9 $dname \
	-r "640x480" \
	--set brightness=${FS_BRIGHT}% --set contrast=${FS_CONT} \
	--save ${FNAME}
