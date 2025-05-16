# builder em Amazon Linux 2
FROM amazonlinux:2 AS builder
RUN yum update -y \
 && yum install -y curl tar gzip \
 && curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - \
 && yum install -y nodejs \
 && yum clean all

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# runtime em Amazon Linux 2
FROM amazonlinux:2
RUN yum update -y \
 && yum install -y nginx \
 && yum clean all

COPY --from=builder /app /app
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site /usr/share/nginx/html

WORKDIR /app
EXPOSE 80 3000
CMD ["sh","-c","service nginx start && node server.js"]