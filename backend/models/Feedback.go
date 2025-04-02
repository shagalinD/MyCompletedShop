package models

import "gorm.io/gorm"

type Feedback struct {
	gorm.Model `json:"-"`
	ID        uint `gorm:"primary key" json:"-"`
	Comment   string `json:"comment" example:"Кот просто восторг!"`
	Rating    float64 `gorm:"required" json:"rating" example:"5"`
	ProductID uint `json:"productId"`
	Product   Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
	// swagger:ignore
	UserID uint `json:"user_id"`
	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}