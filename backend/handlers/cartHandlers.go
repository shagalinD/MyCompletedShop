package handlers

import (
	"errors"
	"kotoshop/models"
	"kotoshop/postgres"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddToCart godoc
// @Summary      Добавляет продукты в корзину
// @Description  Добавляет новые продукты в корзину пользователя
// @Tags         Cart
// @Accept       json
// @Produce      json
// @Param item body models.RequestCartItem true "Данные товара"
// @Param Authorization header string true "Токен в формате Bearer {token}" default(Bearer )
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/cart/add_product [post]
func AddToCart(c *gin.Context) {
	userID := c.GetUint("userID")

	var req models.RequestCartItem

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Ошибка при парсинге товара корзины: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error":"Неверные данные",
		})
		return 
	}

	var cart models.Cart 

	if err := postgres.DB.Preload("Items.Product").FirstOrCreate(&cart, models.Cart{UserID: userID}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error on getting user's cart",
		})
		return 
	}

	var product models.Product 

	if err := postgres.DB.First(&product, req.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":"product not found",
		})
		return 
	}

	var item models.CartItem
	if err := postgres.DB.Where("cart_id = ? AND product_id = ?", cart.ID, product.ID).First(&item).Error; err == nil {
		if result := postgres.DB.Model(&item).Update("quantity", item.Quantity+req.Quantity).Error; result != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":"error on adding cart products",
			})
			return
		}
	} else {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			item = models.CartItem{
				CartID: cart.ID,
				ProductID: product.ID,
				Quantity: 1,
				Price: float64(product.Price),
			}
	
			if result := postgres.DB.Create(&item).Error; result != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":"error on creaing new cart product",
				})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":"error on getting cart product",
			})
			return
		}
	}

	cart.Total = cart.Total + item.Price

	if err := postgres.DB.Save(&cart).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error":"error on updating user cart total",
		})
		return 
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"user's cart products added successfully",
	})
}

// GetCart godoc
// @Summary      Возвращает корзину 
// @Description  Возвращает корзину со всеми товарами пользователя
// @Tags         Cart
// @Accept       json
// @Produce      json
// @Param Authorization header string true "Токен в формате Bearer {token}" default(Bearer )
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/cart/get_cart [get]
func GetCart(c *gin.Context) {
	userID := c.GetUint("userID")

	var cart models.Cart 
	if err := postgres.DB.Preload("Items.Product").Where("user_id = ?", userID).FirstOrCreate(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusOK, models.Cart{
				UserID: userID,
				Items: []models.CartItem{},
				Total: 0,
			})
			return
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":"error on getting user's cart",
			})
			return 
		}
	}

	c.JSON(http.StatusOK, cart)
}

// DeleteCartItem godoc
// @Summary      Удаляем продукт корзины
// @Description  Удаляем продукты из корзины пользователе по product_id
// @Tags         Cart
// @Accept       json
// @Produce      json
// @Param Authorization header string true "Токен в формате Bearer {token}" default(Bearer )
// @Param ProductID body models.RequestRemoveCartItem true "Id продукта"
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/cart/remove_product [put]
func DeleteCartItem(c *gin.Context) {
	userID := c.GetUint("userID")

	var req struct {
		ProductID uint `json:"product_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return 
	}

	var item models.CartItem

	if err := postgres.DB.Model(&item).Joins("JOIN carts ON carts.id= cart_items.cart_id").Where("product_id = ? AND user_id = ?", req.ProductID, userID).First(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if item.Quantity == 1 {
		if err := postgres.DB.Delete(&item).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":"item deleted successfully",
		})
		return 
	} else {
		if err := postgres.DB.Model(&item).Update("quantity", item.Quantity-1).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":err.Error(),
			})
			return 
		}

		c.JSON(http.StatusOK, gin.H{
			"message":"item deleted successfully",
		})
	}
}

// CleanCart godoc
// @Summary      Очищает корзину
// @Description  Полностью очищает корзину пользователя
// @Tags         Cart
// @Accept       json
// @Produce      json
// @Param Authorization header string true "Токен в формате Bearer {token}" default(Bearer )
// @Success      200  {object}  map[string]interface{}
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /api/cart/clean_cart [delete]
func CleanCart(c *gin.Context) {
	userID := c.GetUint("userID")

	var cart models.Cart 

	if err := postgres.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":"user's cart not found",
		})
		return 
	} 

	if err := postgres.DB.Delete(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error on deleting user's cart",
		})
		return 
	}

	c.JSON(http.StatusOK, gin.H{
		"message":"user's cart deleted successfully",
	})
}