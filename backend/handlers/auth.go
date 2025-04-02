package handlers

import (
	"fmt"
	"kotoshop/models"
	"kotoshop/postgres"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var secret = []byte(os.Getenv("SECRET_KEY"))

func createAccessToken(userId uint) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userId,                    // Subject (user identifier)
		"iss": "todo-app",                  // Issuer
		"exp": time.Now().Add(time.Minute * 15).Unix(), // Expiration time
		"iat": time.Now().Unix(),                 // Issued at
})

	tokenString, err := claims.SignedString(secret)

	if err != nil {
		return "", err
	}

// Print information about the created token
	return tokenString, nil
}

// Signup godoc
// @Summary      Регистрирует нового пользователя
// @Description  Регистрирует пользователя через почту и пароль
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param user body models.User true "Данные пользователя"
// @Success      200  {object}  models.User
// @Failure      400  {object}  map[string]interface{}
// @Failure      404  {object}  map[string]interface{}
// @Failure      500  {object}  map[string]interface{}
// @Router       /api/signup [post]
func Signup(c *gin.Context) {
	var user models.User 

	if err := c.ShouldBindJSON(&user); err != nil {
		log.Print(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err, 
		})

		return
	}

	userPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
		log.Print(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to hash password",
		})

		return
	}

	user.Password = string(userPassword)

	if err := postgres.DB.Create(&user).Error; err != nil {
    log.Print("Ошибка при создании пользователя:", err) 
		
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("Ошибка при создании пользователя: %s", err),
		})
    return
}

	accessToken, accessErr := createAccessToken(user.ID)

	if accessErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error on creating token",
		})

		return
	} 

	c.JSON(http.StatusAccepted, gin.H{
		"message": "user successfully signed up",
		"token": accessToken,
	})
}


// Login godoc
// @Summary      Аутентифицирует пользователя
// @Description  Аутентифицирует пользователя через почту и пароль
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param user body models.User true "Данные пользователя"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/login [post]
func Login(c *gin.Context) {
	var user models.User 

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err, 
		})

		return
	}

	var foundUser models.User 

	if err := postgres.DB.Where("email = ?", user.Email).First(&foundUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials",})

		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials",})

		return
	}

	accessToken, accessErr := createAccessToken(user.ID)

	if accessErr != nil  {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error on creating token",
		})

		return
	} 

	c.JSON(http.StatusAccepted, gin.H{
		"message": "user successfully signed up",
		"token": accessToken,
	})
}

// Profile godoc
// @Summary      Возвращает данные о пользователе
// @Description  Возвращает данные о пользователе при корректном токене
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param  Authorization header string true "Access Token"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/profile [get]
func Profile(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.AbortWithStatus(http.StatusBadRequest)
	}

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}

		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":"access token expired",
			})
		}

		var user models.User 
		if err := postgres.DB.Select("email").First(&user, claims["sub"]).Error; err != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"email": user.Email,
		})
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}