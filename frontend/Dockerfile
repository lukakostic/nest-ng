FROM node:14 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ng build --prod

FROM nginx:1.19

COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html
