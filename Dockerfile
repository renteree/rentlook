# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:12.16.1-alpine as build

ADD . /build

ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_PLACES_API

WORKDIR /build

RUN npm ci && \
    npm install -g @babel/core @babel/cli && \
    npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15-alpine
COPY --from=build /build/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
