package config

import (
	"os"
)

var (
	SecretKey        = os.Getenv("JWT_SECRET")
	RefreshSecretKey = os.Getenv("JWT_REFRESH_SECRET")
)
