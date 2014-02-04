
FROM dockerfile/nodejs

ADD . /src
RUN cd /src; npm install

EXPOSE  5000
EXPOSE  8632

CMD ["node", "/src/main.js"]