FROM golang:1.24-alpine AS builder
WORKDIR /app

# Копируем зависимости и исходники
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

EXPOSE 8080
CMD ["./main"]