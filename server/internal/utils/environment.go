package utils

import "os"

func IsDevelopment() bool {
	return getEnvironment() == "development"
}

func IsProduction() bool {
	return getEnvironment() == "production"
}

func getEnvironment() string {
	return os.Getenv("ENVIRONMENT")
}
