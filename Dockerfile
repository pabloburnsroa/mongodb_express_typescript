FROM node:latest

RUN npm install -g nodemon concurrently

WORKDIR /app

COPY package.json .

RUN npm install

COPY . . 

EXPOSE 8000

CMD ["npm", "run", "dev" ]