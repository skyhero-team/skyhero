export SSID=skyhero
export IP=192.168.43.86

killall udhcpd; iwconfig ath0 mode managed essid ${SSID}; ifconfig ath0 ${IP} netmask 255.255.255.0 up;