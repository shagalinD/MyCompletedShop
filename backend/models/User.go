package models

import "gorm.io/gorm"

type User struct {
	gorm.Model `json:"-"`
	Password string `json:"password" example:"12345678"`
	Email    string `gorm:"unique;not null" json:"email" example:"example@example.com"`
}