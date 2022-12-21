FROM node:alpine

EXPOSE 1337

WORKDIR /var/www
COPY package.json /var/www/
RUN npm install
COPY html_table_to_markdown.js /var/www
COPY url_to_markdown_apple_dev_docs.js /var/www
COPY url_to_markdown_common_filters.js /var/www
COPY url_to_markdown_formatters.js /var/www
COPY url_to_markdown_processor.js /var/www
COPY url_to_markdown_readers.js /var/www
COPY index.js /var/www/
ENV PORT=1337
