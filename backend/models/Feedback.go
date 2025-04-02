package models

import "gorm.io/gorm"

type Feedback struct {
	gorm.Model `json:"-"`
	ID        uint `gorm:"primary key" json:"-"`
	Comment   string `json:"comment" example:"Кот просто восторг!"`
	Rating    float64 `gorm:"required" json:"rating" example:"5"`
	ProductID uint `json:"product_id"`
	Product   Product `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"-"`
}