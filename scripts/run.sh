docker build . --tag rentlook
docker run -e PORT=3000 -p 3000:3000 -d rentlook
