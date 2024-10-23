package helper

import (
	"fmt"
	"strings"
)

// ReplacePortInAddr replaces the port part in the ipAddr string with what is passed in newPort
func ReplacePortInAddr(ipAddr string, newPort string) (string, error) {
	parts := strings.Split(ipAddr, ":")
	if len(parts) <= 1 {
		return "", fmt.Errorf("not valid ip %v did not find seperator \":\"", ipAddr)
	}

	return fmt.Sprintf("%v:%v", parts[0], newPort), nil
}
