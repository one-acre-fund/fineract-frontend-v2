###############
### STAGE 1: Build app
###############
FROM node:16-alpine as builder

RUN apk add --no-cache git

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./ /usr/src/app/

RUN npm cache clear --force && \
  npm config set fetch-retry-maxtimeout 120000 && \
  npm install --location=global @angular/cli@14.2.13 && \
  npm install && \
  ng build --configuration production --output-path=/dist

###############
### STAGE 2: Serve app with nginx ###
###############
FROM nginx:1.25.2-alpine

COPY --from=builder /dist /usr/share/nginx/html

COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
