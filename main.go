package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

type AsyncResult struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func main() {
	http.HandleFunc("/perform-task", performTaskHandler)

	fmt.Println("Starting async service on port 8082...")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		fmt.Println("Error starting server:", err)
	}
}

func performTaskHandler(w http.ResponseWriter, r *http.Request) {

	time.Sleep(time.Duration(rand.Intn(5)+5) * time.Second) // Задержка от 5 до 10 секунд

	result := "Успех"
	if rand.Intn(2) == 0 {
		result = "Провал"
	}

	response := AsyncResult{
		Status:  result,
		Message: fmt.Sprintf("Задача завершена с результатом: %s", result),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
