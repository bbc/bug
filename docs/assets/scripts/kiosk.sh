#!/bin/bash

# Variables
configFile=/etc/gdm3/custom.conf
startupFile=/home/bug/bug.sh

read -r -d '' startupFileContents <<- EOM
    # Run this script in display 0 - the monitor
    export DISPLAY=:0

    # Hide the mouse from the display
    unclutter &

    # If Chromium crashes (usually due to rebooting), clear the crash #flag so we don't have the annoying warning bar
    sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/bug/.config/chromium/Default/Preferences
    sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/bug/.config/chromium/Default/Preferences

    # Run Chromium and open tabs
    /usr/bin/chromium-browser --window-size=1920,1080 --kiosk --window-position=0,0 http://127.0.0.1 &
EOM

# Install Desktop Environment & Chromium
apt install -y xfce4
apt install -y chromium-browser unclutter
adduser bug


# Create BUG file
if [ -e $startupFile ]; then
  echo "Config $startupFile already exists!"
else
  echo >> $startupFileContents
fi


# Prevent screen from sleeping
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# Reboot
reboot