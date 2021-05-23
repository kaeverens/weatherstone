# weatherstone
a project for using tensorflow to look at a hanging rock and tell if it's windy or raining, etc

designed to run on a Raspberry Pi using the standard Raspberry Pi OS. a cheap webcam is attached.

adjust the pi's timezone so we have a consistent UTC base:

```
cd /etc/ && rm localtime -f && ln -s /usr/share/zoneinfo/UTC localtime
```

create a directory for the images to sit in

```
cd ~/weatherstone/www/ && mkdir images
```

a cron entry should be created that runs get-image.sh every minute

```
* * * * * cd /home/pi/weatherstone/ && sh get-image.sh
```

install a web server and server-side language

```
sudo apt-get install nginx php-fpm
sudo cp weatherstone.nginx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl enable php7.3-fpm.service
sudo systemctl start php7.3-fpm.service
sudo systemctl enable nginx
sudo systemctl start nginx
```
