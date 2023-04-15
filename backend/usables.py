#by rk
import creds
import base64

import docx
import pytesseract
import io

from PIL import Image
from pptx import Presentation
from pdf2image import convert_from_bytes


#comment down while deploying
pytesseract.pytesseract.tesseract_cmd = r'D:\Tesseract-OCR\tesseract.exe'

def IsValidUser(name):
    if creds.collection.find_one({"uid":name}):
        return True
    return False


def getIndex(name):
    if not creds.es.indices.exists(index=name):
        creds.es.indices.create(index=name)
    return name


def get_docx_Text(file_bytes):
    doc = docx.Document(io.BytesIO(file_bytes))
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    return '\n'.join(fullText)

def get_image_Text(file_bytes):
    image = Image.open(io.BytesIO(file_bytes))
    context =  pytesseract.image_to_string(image)
    return context

def get_pdf_Text(file_bytes):
    # images = convert_from_bytes(file_bytes,poppler_path=popplers_path)
    images = convert_from_bytes(file_bytes)
    return "\n".join([pytesseract.image_to_string(img) for img in images])
    
def get_ppt_Text(file_bytes):
    ppt = Presentation(io.BytesIO(file_bytes))
    return "\n".join([shape.text for slide in ppt.slides for shape in slide.shapes])


def extractor(bytes,ext):
    type_functions = {
        "docx": get_docx_Text,
        "pdf": get_pdf_Text,
        "pptx": get_ppt_Text,
        "txt": lambda txt_bytes: txt_bytes.decode()

    }

    func = type_functions.get(ext,get_image_Text)

    return func(bytes)


def data_url_to_image(data_url,filename):

        ext = filename.split('.')[-1]
        raw_b64 = data_url.split(",")[1]

        #base64 to bytes
        file_byte = base64.b64decode(raw_b64)
        
        context = extractor(file_byte,ext)
        return context


