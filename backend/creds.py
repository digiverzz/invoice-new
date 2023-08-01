#by rk
from elasticsearch import Elasticsearch
import imaplib
from dotenv import load_dotenv
import os
import email
from pymongo import MongoClient
from pywebhdfs.webhdfs import PyWebHdfsClient

load_dotenv('./env')


es = Elasticsearch([os.getenv('elastic_url')],basic_auth=(os.getenv('elastic_username'),os.getenv('elastic_password')),verify_certs=False)


# es = Elasticsearch(["https://localhost:9200"],basic_auth=("elastic","_y=PZ4+SNmrs2Tq6m7CV"),verify_certs=False)

#mongo db
uri = os.getenv('mongo_uri')
client = MongoClient(uri)
database = client['invoice']
collection = database['users']

modelToLoad='best_1000.pt'

mail = imaplib.IMAP4_SSL("imap.gmail.com",993)

testFilePath=r"./Sample_files"

mail.login(os.getenv('email'),os.getenv('mail_pass'))

poppler_path="C:\applications\Release-23.07.0-0\poppler-23.07.0\Library\bin"

mail.select('Inbox')

hdfs= PyWebHdfsClient(host=os.getenv('hdfshost'),port=os.getenv('hdfsport'),user_name=os.getenv('hdfsuser'))