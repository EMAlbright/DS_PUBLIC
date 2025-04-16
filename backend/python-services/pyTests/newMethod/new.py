import fitz  
from PIL import Image
import pytesseract
import io

# OCR to detect text
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  

Book = {
  "type": "book",
  "title": "string",
  "author": "string",
  "genre": "string",
  "publication_date": "string",
  "summary": "string",                         
  "chapters": [
    {
      "title": "string",
      "summary": "string",                     
      "sections": [
        {
          "heading": "string",
          "content": "string"
        }
      ]
    }
  ]
}

# first test simply getting text from pdf
def get_text(file_path):
    text = ""
    
    # Open the PDF
    with fitz.open(file_path) as doc:
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # If the page contains images, perform OCR
            pix = page.get_pixmap()  
            img = Image.open(io.BytesIO(pix.tobytes())) 
            
            # extract text from the image
            page_text = pytesseract.image_to_string(img)
            
            # Add the extracted text to the result
            text += page_text
    
    return text

if __name__ == "__main__":
    test = get_text(r"C:\Users\Ethan Albright\Downloads\as_a_man_thinketh.pdf")
    print(test)
