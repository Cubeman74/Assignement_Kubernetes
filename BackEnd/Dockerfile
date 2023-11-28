FROM node:18-alpine
RUN npm install -g nodemon
EXPOSE 3000
WORKDIR /backApp
COPY . .
RUN npm install
ENV DEBUG='ktback:*'
ENTRYPOINT [ "npm", "run", "dev" ]