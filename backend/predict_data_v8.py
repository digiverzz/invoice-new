from ultralytics import YOLO
import cv2
from field_extraction import *
import nltk
from nltk.corpus import stopwords
from text_categorizing import categorize

lang_input_glob = 'english'           
predicted_response = {
    'company_name':'',
    'from_address':'',
    'to_address':'',
    'invoice_date':'',
    'due_date':'',
    'phone_number':'',
    'invoice_number':'',
    'currency':'',
    'total':'',
    'sub_total':'',
    'tax':'',
    'discount':'',
    'barcode':'',
    'logo':'',
    'custom': [],
    'category':'',
    'pdf_image':None,
    'bill_of_materials':[
        {
            "description":[],
            "quantity":[],
            "unit_price":[],
            "price":[],
        }
    ]
}

def empty_resp():
    return {
    'company_name':'',
    'from_address':'',
    'to_address':'',
    'invoice_date':'',
    'due_date':'',
    'phone_number':'',
    'invoice_number':'',
    'currency':'',
    'total':'',
    'sub_total':'',
    'tax':'',
    'discount':'',
    'barcode':'',
    'logo':'',
    'custom': [],
    'category':'',
    'pdf_image':None,
    'bill_of_materials':[
        {
            "description":[],
            "quantity":[],
            "unit_price":[],
            "price":[],
        }
    ]
}


def predict(file_input,lang_input):
    global predicted_response
    predicted_response = empty_resp()
    base_str = file_input
    if base_str is bytes:
        imageBinaryBytes = base_str
        image = np.asarray(bytearray(imageBinaryBytes), dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    elif type(file_input)==np.ndarray:
        image = file_input
    else:
        predicted_response['pdf_image'] = base_str
        base_str = base_str.split(",")[1]
        binary = base64.b64decode(base_str)
        image = np.asarray(bytearray(binary), dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    global lang_input_glob
    lang_input_glob = lang_input
    exist_classes = []
    ########class labels
    classes = ['company_name', 'from_address', 'to_address', 'date', 'phone_number', 'invoice_number', 'total', 'sub_total', 'tax', 'discount', 'barcode', 'logo', 'description_col', 'qty_col', 'price_col', 'unitprice_col', 'header', 'table']
    image2 = image

    ###### deection of OCR 
    model = YOLO(r'backend\bestv8.pt')
    results = model(image2,conf=0.25)

    dw = image2.shape[1]
    dh = image2.shape[0]
    table_values = []
    currency = ''
    header = []
    column_count = 0
    header_len = 0

    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1,y1,x2,y2 = box.xyxy[0]
            x1,y1,x2,y2 = int(x1),int(y1),int(x2),int(y2)
            #drwing the rectangle
            cv2.rectangle(cap,(x1,y1),(x2,y2),(255,0,255),3)
            # initate the class
            cls = int(box.cls[0])

            #print(x1,y1,x2,y2,cls)
            #3################################ cropping the detected location
            w,h = x2-x1,y2-y1
            cropped_image = cap[y1:y1 + h, x1:x1 + w]
            label = classes[cls]


    ################################ extracting the texting and storing
            if label == 'from_address':
            # s = address(cropped_image)
                predicted_response['from_address'] = address(cropped_image,lang_input)
            elif label == 'to_address':
                predicted_response['to_address'] = address(cropped_image,lang_input)
            elif label == 'total':
                predicted_response['total'] = total(cropped_image,lang_input)
                if currency=='':
                    currency = currency_extract(cropped_image,lang_input)
                    predicted_response['currency'] = currency
            elif label == 'invoice_number':
                predicted_response['invoice_number'] = invoice_number(cropped_image,lang_input)
            elif label == 'date':
                date_res = date_extract(cropped_image,lang_input)
                print("date_res",date_res)
                if list(date_res.keys())[0]=="invoice_date":
                    predicted_response['invoice_date'] = date_res['invoice_date']
                if list(date_res.keys())[0]=="due_date":
                    predicted_response['due_date'] = date_res['due_date']
            elif label == 'company_name':
                predicted_response['company_name'] = company_name_extract(cropped_image)
            elif label == 'qty_col':
                if lang_input=='english':
                    predicted_response['bill_of_materials'][0]['quantity'] = [] if col_extract(cropped_image)==None else col_extract(cropped_image)
                    
                elif lang_input=='arabic':
                    predicted_response['bill_of_materials'][0]['quantity'] = arabic_col_extract(cropped_image)
                column_count+=1
            elif label == 'price_col':
                if lang_input=='english':
                    predicted_response['bill_of_materials'][0]['price'] = [] if col_extract(cropped_image)==None else col_extract(cropped_image)
                    
                elif lang_input=='arabic':
                    predicted_response['bill_of_materials'][0]['price'] = arabic_col_extract(cropped_image)
                column_count+=1         
            elif label == 'description_col':
                if lang_input=='english':
                    predicted_response['bill_of_materials'][0]['description'] = [] if col_extract(cropped_image)==None else col_extract(cropped_image)
                    
                elif lang_input=='arabic':
                    predicted_response['bill_of_materials'][0]['description'] = arabic_col_extract(cropped_image)
                column_count+=1

            elif label == 'unitprice_col':
                if lang_input=='english':
                    predicted_response['bill_of_materials'][0]['unit_price'] = [] if col_extract(cropped_image)==None else col_extract(cropped_image)
                    
                elif lang_input=='arabic':
                    predicted_response['bill_of_materials'][0]['unit_price'] = arabic_col_extract(cropped_image)
                column_count+=1
            
            elif label == 'sub_total':
                predicted_response['sub_total'] = total(cropped_image,lang_input)
                if currency=='':
                    currency = currency_extract(cropped_image,lang_input)
                    predicted_response['currency'] = currency
            elif label == "phone_number":
                predicted_response['phone_number'] = phone_number(cropped_image,lang_input)
            elif label == 'logo':
                predicted_response['logo'] = base64_create(cropped_image)
            elif label == 'barcode':
                predicted_response['barcode'] = base64_create(cropped_image)
            elif label == 'tax':
                predicted_response['tax'] = tax_extract(cropped_image,lang_input)
                if currency=='':
                    currency = currency_extract(cropped_image,lang_input)
                    predicted_response['currency'] = currency
            elif label == 'discount':
                predicted_response['discount'] = discount_extract(cropped_image,lang_input)
                if currency=='':
                    currency = currency_extract(cropped_image,lang_input)
                    predicted_response['currency'] = currency
            elif label == 'header':
                header = table(cropped_image)[0]
                #print("headers 1",header)
                header_len = len(header)
            elif label == 'table':
                table_img = cropped_image
                s = table(cropped_image)
                table_values = s[1]

################################################################################################
    g = []
    for i in table_values:
        f = ''.join([j for j in " ".join(i) if not j.isdigit()])
        g.append(f)
    sentence = "".join(g)
    sentence = sentence.lower()
    words = nltk.word_tokenize(sentence.lower())
    new_words = [word for word in words if word.isalnum()]

    WordSet = []
    for word in new_words:
        if word not in set(stopwords.words("english")):
            WordSet.append(word)
    final_text = " ".join(WordSet)
    predicted_response['category'] = categorize(final_text)[0]

    return predicted_response



if __name__ == '__main__':

    cap = cv2.imread(r'backend\yolov8_testing\test\images\1.jpg')
    dw = cap.shape[1]
    dh = cap.shape[0]
    model = YOLO(r'backend\bestv8.pt')
    results = model(r'D:\kaar\invoice-new\backend\yolov8_testing\test\images\2.jpg',conf=0.25)
    classes = ['company_name', 'from_address', 'to_address', 'date', 'phone_number', 'invoice_number', 'total', 'sub_total', 'tax', 'discount', 'barcode', 'logo', 'description_col', 'qty_col', 'price_col', 'unitprice_col', 'header', 'table']
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1,y1,x2,y2 = box.xyxy[0]
            x1,y1,x2,y2 = int(x1),int(y1),int(x2),int(y2)
            #drwing the rectangle
            cv2.rectangle(cap,(x1,y1),(x2,y2),(255,0,255),3)
            # initate the class
            cls = int(box.cls[0])

            #print(x1,y1,x2,y2,cls)
            #3################################
            w,h = x2-x1,y2-y1
            cropped_image = cap[y1:y1 + h, x1:x1 + w]
            
            #########################got the cropped image need to text extract

            label = classes[cls]

            if label == 'from_address':
                predicted_response = address(cropped_image,'english')
                cv2.imshow('img',cropped_image)
                print(predicted_response)

            
    

    cv2.waitKey(0)