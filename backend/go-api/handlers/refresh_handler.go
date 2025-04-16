package handlers

import (
	"datasmith/config"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// handle refresh token (every 15 min)
func Refresh(c *gin.Context) {
	// get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	fmt.Print("refresh token current: ", refreshToken)
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing refresh token"})
		return
	}

	// parse and validate
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(config.RefreshSecretKey), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	// get username from resfresh token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	userID := claims["userID"].(string)

	// generate new 15 min access token
	newAccessToken, err := generateToken(userID, config.SecretKey, time.Minute*15)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate access token"})
		return
	}

	// generate new 3 day refresh token
	newRefreshToken, err := generateToken(userID, config.RefreshSecretKey, time.Hour*24*3)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate refresh token"})
		return
	}

	// set new refresh token in http cookie
	c.SetCookie("refresh_token", newRefreshToken, 3600*24*3, "/", "", false, true)

	//return new access token
	c.JSON(http.StatusOK, gin.H{"access_token": newAccessToken})

}
