# Fast-Api backend

To create a FastAPI backend for the entire invoice text extraction process, including YOLO object detection, Tesseract OCR, and NLP-based category classification, you can follow these steps:

1. Set Up FastAPI:
   * Install FastAPI using a package manager like pip: `pip install fastapi`.
   * Create a new Python file, e.g., `app.py`, to define your FastAPI application.
   * Import the necessary FastAPI modules and dependencies.
2. Define API Endpoints:
   * Define the necessary API endpoints to receive requests and send responses.
   * For example, we created a POST endpoint at `/predict` to handle the invoice extraction process.
   * Specify the expected request payload, which may include the invoice image or file.
   * Create a function to process the request, which will execute the invoice text extraction pipeline.
3. Implement the Text Extraction Pipeline:
   * Inside the processing function, load the invoice image or file from the request payload.
   * Utilize the YOLO model to detect and localize the regions of interest within the invoice.
   * Extract the textual content from the identified regions using Tesseract OCR.
   * Pass the extracted text to the NLP-based category classification model to predict the invoice category.
4. Return the Response:
   * Format the extracted text and predicted category as a response object.
   * Return the response to the client, providing the necessary extracted information.
5. Run the FastAPI Application:
   * Add a main block to the `app.py` file to run the FastAPI application using `uvicorn`.
   * Run the application using the following command: `uvicorn app:app --reload`.
   * The `--reload` flag enables automatic reloading during development.
6. Test the API:
   * Use an API testing tool like URL, Postman, or Python's `requests` library to send POST requests to your defined endpoint.
   * Include the invoice image or file in the request payload.
   * Receive the response, which should include the extracted text and predicted category.\
