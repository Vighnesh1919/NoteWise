package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserId string `json:"user_id"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken( userID,role,secret string ) ( string ,error) {

	claims := Claims{

		UserId: userID,
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(72*time.Hour)),
			IssuedAt: jwt.NewNumericDate(time.Now()), 
		},
	}


	token  := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	return token.SignedString([]byte(secret))
}

func ParseToken(tokenstr,secret string ) ( *Claims,error) {



	token ,err := jwt.ParseWithClaims(tokenstr,&Claims{},func ( t *jwt.Token)(interface{},error) {
		return []byte(secret),nil 
	})
	 if err != nil || !token.Valid {
        return nil, errors.New("invalid token")
    }
    claims, ok := token.Claims.(*Claims)
    if !ok {
        return nil, errors.New("invalid claims")
    }
    return claims, nil
}