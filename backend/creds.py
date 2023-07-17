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


mail = imaplib.IMAP4_SSL("imap.gmail.com",993)


mail.login(os.getenv('email'),os.getenv('mail_pass'))

#poppler_path=
#
mail.select('Inbox')

hdfs= PyWebHdfsClient(host=os.getenv('hdfshost'),port=os.getenv('hdfsport'),user_name=os.getenv('hdfsuser'))