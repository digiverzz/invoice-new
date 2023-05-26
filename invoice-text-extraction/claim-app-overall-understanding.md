# Claim App overall understanding

<figure><img src="../.gitbook/assets/claim app flow (3).png" alt=""><figcaption></figcaption></figure>

To create a claim app for employees where they can upload invoice images and claim expenses, you can follow these steps:

1. Set up the FastAPI Backend:
   * We Used the existing FastAPI backend you created for invoice text extraction as the foundation.
   * We need to Define the additional API endpoints to handle the claim app functionality, such as uploading invoice images and submitting expense claims.
   * We need to Implement the necessary logic to process the uploaded images and extract relevant information using the invoice text extraction pipeline.
   * We have to Store the extracted information, including the invoice text and category, in a database or data storage system.
2. For Creating a React Frontend:
   * Set up a new React project using a command-line tool like `create-react-app`.
   * Design and develop the frontend components and pages for your claim app.
   * Create forms and input fields to capture employee details, invoice images, and expense information.
   * Implement functionality to upload invoice images from the frontend to the FastAPI backend for processing.
   * Display the extracted information, such as the invoice text and predicted category, to the employees for verification and submission.
3. For Integrating the React Frontend with the FastAPI Backend:
   * We Use HTTP requests, such as `fetch` or Axios, from the React frontend to communicate with the FastAPI backend.
   * We Send POST requests to the appropriate API endpoints to upload invoice images and submit expense claims.
   * We can Receive and handle responses from the backend, displaying relevant information or error messages to the employees.
4. For Enhancing the User Experience:
   * We Implemented like image preview before uploading, form validation, and error handling in the React frontend.
   * Customized the frontend appearance with CSS and styling libraries to create an intuitive and visually appealing interface.
5. Test and Debug:
   * We Tested the end-to-end functionality of the claim app by uploading invoice images, submitting claims, and verifying the extracted information.
   * We Debugged for issues that may arise during the testing phase, ensuring smooth communication between the frontend and backend components.
6. Deploy the Claim App:
   * Choose a hosting provider or platform (such as Azure App Service) to deploy both the FastAPI backend and React frontend.
   * We Configured the necessary deployment settings and ensure the backend and frontend are properly connected.
   * We Deployed the application to the chosen hosting environment, making it accessible to employees for claiming expenses.

### Claim App Flow

\
claim app flow includes the process of an employee raising a claim and the manager's role in accepting or rejecting it:

1. Employee Raises a Claim:
   * The employee logs into the Claim App using their credentials.
   * In the app interface, the employee navigates to the "Raise a Claim" section.
   * The employee fills out the necessary information, such as the expense details, amount, and any additional notes.
   * The employee uploads the invoice image, which triggers the invoice text extraction process on the backend.
   * The app displays a confirmation message indicating that the claim has been raised successfully.
2. Invoice Text Extraction and Category Classification:
   * The FastAPI backend receives the uploaded invoice image and processes it using the invoice text extraction pipeline.
   * The image undergoes YOLO object detection to identify the invoice region.
   * Tesseract OCR extracts text from the invoice image, capturing relevant details such as vendor name, date, and total amount.
   * The extracted text is passed through an NLP-based classification model to determine the category of the invoice (e.g., travel, accommodation, meals).
   * The extracted information and the assigned category are stored in the backend database along with the claim details.
3. Manager Reviews the Claim:
   * The manager, who also has access to the Claim App, logs in using their credentials.
   * In the app interface, the manager navigates to the "Claims Review" section.
   * The manager can view a list of pending claims raised by employees.
   * For each claim, the manager can review the invoice text, extracted information, and the assigned category.
   * Based on the information provided, the manager can either accept or reject the claim.
4.  Accepting or Rejecting a Claim:

    * If the manager decides to accept the claim:
      * The app updates the claim status to "Accepted" in the backend database.
      * An approval notification is sent to the employee, informing them that their claim has been approved.
    *   If the manager decides to reject the claim:

        * The app updates the claim status to "Rejected" in the backend database.
        * A rejection notification is sent to the employee, providing a reason for the rejection.



    To Know more about the claim app flow refer the above Claim app flow diagram.
