package handlers

import (
	"errors"
	"fmt"
	"kotoshop/models"
	"kotoshop/postgres"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// PostFeedback godoc
// @Summary      Отправляет отзыв
// @Description  Отправляет отзыв пользователя на товар
// @Tags         Feedback
// @Accept       json
// @Produce      json
// @Param feedback body models.Feedback true "Отзыв"
// @Param Authorization header string true "Токен в формате Bearer {token}" default(Bearer )
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/feedback/post [post]
func PostFeedback(c *gin.Context) {
	userID := c.GetUint("userID")

	var feedback models.Feedback

	if err := c.ShouldBindJSON(&feedback); err != nil {
		log.Print(fmt.Printf("error on parsing feedback %s", err.Error()))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "error on parsing feedback",
		})

		return 
	}

	log.Printf("userID: %d", userID)
	feedback.UserID = userID

	if err := postgres.DB.Create(&feedback).Error; err != nil {
		log.Print(fmt.Printf("error on creating feedback %s", err))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("error on creating feedback: %s", err),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"feedback created successfully",
	})
}

// GetFeedbacks godoc
// @Summary      Возвращает отзывы
// @Description  Возвращает список всех отзывов на товар
// @Tags         Feedback
// @Accept       json
// @Produce      json
// @Param product_id query uint true "ID товара"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/feedback/get_all [get]
func GetFeedbacks(c *gin.Context) {
	productIDString := c.Query("product_id")

	productID, err := strconv.Atoi(productIDString)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"error on parsing product id",
		})
		return
	}

	var feedbacks []models.Feedback
	if err := postgres.DB.Where("product_id = ?", productID).Find(&feedbacks).Error; err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			c.JSON(http.StatusOK, []models.Feedback{})
		default:
			log.Print(err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":"error on getting feedback",
			})
		}
		return
	}

	c.JSON(http.StatusOK, feedbacks)
}

