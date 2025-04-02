package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model `json:"-"`
	UserID uint `json:"user_id"`
	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Total float64 `json:"total" example:"53.999"`
	Status string `json:"status" example:"created"`
	PaymentURL string `json:"payment_url"`
}