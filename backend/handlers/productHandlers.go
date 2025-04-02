package handlers

import (
	"fmt"
	"kotoshop/models"
	"kotoshop/postgres"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateProduct godoc
// @Summary      Добавляет товар
// @Description  Добавляет новый товар
// @Tags         Products
// @Accept       json
// @Produce      json
// @Param product body models.Product true "Данные о товаре"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/products/post [post]
func CreateProduct(c *gin.Context) {
	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"error on parsing product",
		})

		return
	}

	if err := postgres.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Sprintf("ошибка при создании товара: %s", err),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"product created successfully",
	})
}

// GetAllProducts godoc
// @Summary      Возвращает товары
// @Description  Возвращает список всех товаров магазина
// @Tags         Products
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/products/get_all [get]
func GetAllProducts(c *gin.Context) {
	var products []models.Product

	if err := postgres.DB.Find(&products).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Ошибка при получении списка товаров",
			})
			return
	}

	c.JSON(http.StatusOK, products)
}