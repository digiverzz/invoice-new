import uvicorn
from fastapi import FastAPI,File,UploadFile, Form,Request,Depends,Body
from typing import List
from pydantic import BaseModel
import pickle
import numpy as np
import argparse
import os
import cv2
from werkzeug.utils import secure_filename
from io import BytesIO
import glob
import requests
import re
from os.path import join, dirname, realpath
import base64
from PIL import Image, ImageFile  # from Pillow
from colorama import Fore  # from native modules
import platform  # from native modules
from os.path import join, dirname, realpath
import json
from detect import start
import io  # from native modules
import platform  # from native modules
import nltk
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, f1_score
from functools import wraps
import datetime
from base64 import b64encode,decodestring
from fastapi.middleware.cors import CORSMiddleware
from dataclasses import dataclass, field
from preprocessing_image import deskew,erode,canny,remove_noise,get_grayscale,match_template,dilate,opening,thresholding
from preprocessing_text import seperate,correction
from field_extraction import *
from user_management import tokencheck
from token_authentication import token_required
from nltk.corpus import stopwords
import user_management
from text_categorizing import categorize
import crop_endpoint
import routes.elastic_search as elastic
import pytesseract
from predict_data import predict
pytesseract.pytesseract.tesseract_cmd = 'C:/Users/lcharankumar/AppData/Local/Tesseract-OCR/tesseract.exe'
import predict_data
from fastapi_utils.tasks import repeat_every
import usables
from usables import predict_from_mail

app = FastAPI()
app.include_router(user_management.userrouter)
app.include_router(crop_endpoint.croprouter)
app.include_router(elastic.router)

@app.on_event("startup")
@repeat_every(seconds=1060) 
def tasks():
    predict_from_mail()



origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)






@app.post('/predict')
async def predicted_output(request:Request):

    fileslist = await request.json()
    res = []
    count = 0
    for i in fileslist:
        print("count",count)
        output = predict_data.predict(str(i['data']),"english")
        res.append(output)
        count+=1
    return {"response":res}
