#!/bin/bash

# connect to the drone's wifi and telnet 192.168.1.1
# see http://www.nodecopter.com/hack#connect-to-access-point
export SSID=skyhero
export IP=192.168.43.86

killall udhcpd; iwconfig ath0 mode managed essid ${SSID}; ifconfig ath0 ${IP} netmask 255.255.255.0 up;