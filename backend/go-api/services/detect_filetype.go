// determine type of file uploaded
package services

import (
	"fmt"
	"strings"
)

func GetPythonEndpoints(content string) string {
	fmt.Print(content)
	if strings.Contains(content, "csv") {
		fmt.Println("Csv Detected")
		return "http://localhost:5000/csv/process"
	} else if strings.Contains(content, "pdf") {
		fmt.Println("PDF Detected")
		return "http://localhost:5000/pdf/process"
	} else if strings.Contains(content, "text") {
		fmt.Println("Text Detected")
		return "http://localhost:5000/txt/process"
	} else if strings.Contains(content, "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
		fmt.Println("Excel Detected")
		return "http://localhost:5000/excel/process"
	} else {
		fmt.Println("Other")
		return "http://localhost:5000/other/process"
	}
}
