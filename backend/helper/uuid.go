package helper

import "github.com/google/uuid"

// Fixed namespace for consistent uuid generation
var customNamespace = uuid.MustParse("01928c0b-a4a1-7a58-a22e-2c0a4f9e47b2")

// GenerateUUIDFromIPAddr generates UUID from ip addr string
func GenerateUUIDFromIPAddr(ipaddr string) uuid.UUID {
	return uuid.NewSHA1(customNamespace, []byte(ipaddr))
}
