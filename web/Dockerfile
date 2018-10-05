FROM node:10-alpine

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install --quiet --no-optional

COPY . .

EXPOSE 7070

CMD [ "npm", "run", "bundle" ]
