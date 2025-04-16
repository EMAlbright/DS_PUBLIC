package handlers

import (
	"datasmith/config"
	"datasmith/services"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// user model
type User struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func generateToken(userID string, secret string, expiry time.Duration) (string, error) {
	fmt.Printf("Creating token for userID: %s\n", userID)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(expiry).Unix(),
	})
	return token.SignedString([]byte(secret))
}

// signup
func Signup(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request"})
		return
	}

	// skip the index, only get hashed val
	hashedPsswd, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err := services.CreateUser(user.Username, string(hashedPsswd), user.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

// login handler
func Login(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request"})
		return
	}

	storedUser, err := services.GetUserByUsername(user.Username)

	// compare hashed passwords to verify
	if err != nil || bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	fmt.Print("User Id from stored user: ", storedUser.Id)
	// generate short lived access token
	accessToken, err := generateToken(storedUser.Id, config.SecretKey, time.Minute*15)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
	}

	//generate long lived JWT (keep user logged in and get new refresh) store in http only cookie (3 days)
	refreshToken, err := generateToken(storedUser.Id, config.RefreshSecretKey, time.Hour*24*3)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate refresh token"})
	}

	// use http only cookie and set jwt token in it
	// TODO: SECURE FLAG should be TRUE in prod (only works in https)
	c.SetCookie("refresh_token", refreshToken, 3600*24*3, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken})
}

// logout handler
func Logout(c *gin.Context) {
	// clear refresh
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
