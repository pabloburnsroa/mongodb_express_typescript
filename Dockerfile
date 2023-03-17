FROM node:latest

RUN npm install -g nodemon concurrently

WORKDIR /src

COPY package.json .

RUN rm -rf build

RUN npm install

COPY . . 

EXPOSE 8000

RUN npm run build

CMD ["node", "build/app.js" ]