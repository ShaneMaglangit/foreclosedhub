package utils

import (
	"crypto/sha256"
	"fmt"
)

func HashSHA256(s string) string {
	hash := sha256.Sum256([]byte(s))
	return fmt.Sprintf("%x", hash)
}
