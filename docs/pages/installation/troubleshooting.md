---
layout: page
title: Troubleshooting
parent: Installation
nav_order: 2
---

Help me! My BUG won't work.

So you've installed BUG - it doesn't work and now you're here. Here are a few common issues and some solutions.

## Q: Can't see BUG in my web browser

A: What's the `port` for the `bug-app` say when you type in `docker ps` to the terminal? You'll only be able to access BUG from this port

## Q: Linux: How do I start BUG in fullscreen browser on startup?

A: You'll need some kind of desktop environment on Linux and then follow the steps below.

1. Install a desktop environemt `sudo apt install -y xfce4`
2. Install chromium `sudo apt install -y chromium-browser unclutter`
3. Add new user `sudo adduser bug`
4. Autologin desktop by editing the file `sudo nano /etc/gdm3/custom.conf` and inserting the following lines in the `[daemon]` section

```bash
[daemon]

# Enabling automatic login
AutomaticLoginEnable = true
AutomaticLogin = bug
```

5. Create a script to run chromium in fullscreen mode `sudo nano /home/bug/bug.sh`.

Add the followiing script to the file.

```bash
#!/bin/bash

# Run this script in display 0 - the monitor
export DISPLAY=:0

# Hide the mouse from the display
unclutter &

# If Chromium crashes (usually due to rebooting), clear the crash #flag so we don't have the annoying warning bar
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/bug/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/bug/.config/chromium/Default/Preferences

# Run Chromium and open tabs
/usr/bin/chromium-browser --window-size=1920,1080 --kiosk --window-position=0,0 http://127.0.0.1 &
```

6. Make the file executable `sudo chmod +x /home/bug/bug.sh`

7. Allow the script to executed after login `sudo mkdir /home/bug/.config/autostart && sudo nano /home/bug/.config/autostart/bug.desktop`. Then add the following information to the file.

```bash
[Desktop Entry]
Type=Application
Name=BUG Desktop
Exec=/home/bug/bug.sh
X-GNOME-Autostart-enabled=true
```

8. Prevent Sleeping with the follows `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

9. Reboot and watch the magic.
