#!/bin/sh

cd /home/hpscanto/duplex-feed/

while inotifywait -e create -e moved_to -e modify --include side_b.pdf /home/hpscanto/duplex-feed/ ; do
	DATE=$(date +"%Y-%m-%d_%H.%M.%S")
	/usr/bin/pdftk A=side_a.pdf B=side_b.pdf shuffle A Bend-1down output /mnt/paperless/consume/scan_${DATE}.pdf
done
