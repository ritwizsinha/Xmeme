#!/bin/bash
echo $PATH
cd server/
npm install

sudo kill -9 $(sudo lsof -t -i:8081)
npm run dev