FROM node
WORKDIR /app

COPY ./server/package*.json ./
RUN npm install

COPY ./server /app

EXPOSE 8080 8081

CMD [ "npm", "run", "dev"]

