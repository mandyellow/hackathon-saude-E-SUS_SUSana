import io
import time
import os
import gzip
import boto3
import json
import hashlib
import subprocess
import os.path
import re
import csv


def clean():
	with open("csv/data_.csv","r") as f:
		lines = csv.reader(f, delimiter=';')
		for line in lines:
			m = open("csv/data_"+line[0]+".csv","a")
			writer = csv.writer(m, delimiter=';')
			writer.writerow(line)
			m.close()


def get_medicine_critics():
	with open("storage/gss_estoque_diario_20170101.csv","r") as f:
		lines = csv.DictReader(f, delimiter=';')
		for line in lines:
			print line
			break






get_medicine_critics()