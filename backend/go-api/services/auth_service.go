// use postgres
// handler user DB
package services

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB(dataSource string) error {
	var err error
	db, err = sql.Open("postgres", dataSource)
	if err != nil {
		return err
	}
	return db.Ping()

}

type User struct {
	Id       string
	Username string
	Password string
	Email    string
}

func CreateUser(username, password, email string) error {
	// insert User in DB
	_, err := db.Exec(
		"INSERT INTO users (username, hashed_password, email) VALUES ($1, $2, $3)",
		username, password, email,
	)
	return err
}

func GetUserByUsername(username string) (User, error) {
	var user User
	err := db.QueryRow("SELECT id, username, hashed_password FROM users WHERE username=$1", username).Scan(&user.Id, &user.Username, &user.Password)
	if err != nil {
		return User{}, errors.New("User not found")
	}
	fmt.Print("Logged in user:", user)
	return user, nil
}
