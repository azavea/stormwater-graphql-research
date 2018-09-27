FROM node:10-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 9991

CMD [ "npm", "run", "prod-server" ]
