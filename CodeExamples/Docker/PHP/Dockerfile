FROM php:8-fpm

# Installing required packages
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    libpq-dev \
    lsb-release \
    gnupg \
    libpng-dev \
    wget --no-install-recommends

# 
# If we need to use ImageMagick insted of GD lib,
# just add libmagickwand-dev in apt dependencies
# and use this script for install and enadle extension.
# 
# RUN set -xe && git clone https://github.com/Imagick/imagick \
# && cd imagick \
# && git checkout master && git pull \
# && phpize && ./configure && make && make install \
# && cd .. && rm -Rf imagick \
# && docker-php-ext-enable imagick
# 
# IMPORTANT!!
# pecl install imagick && docker-php-ext-enable imagick - will not work
# cuz PECL repo is still have old version (3.4.4). Waiting for update... 


# Install postgres client, just-in-case.
# The main reason use client - control DB backupd in application
# it's just convenient. 
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get -y install postgresql-client-13 --no-install-recommends

# Installing composer
RUN wget https://getcomposer.org/installer \
    && php installer \
    && mv composer.phar /usr/local/bin/ \
    && ln -s /usr/local/bin/composer.phar /usr/local/bin/composer

# Turn on extensions
RUN docker-php-ext-install opcache bcmath zip pdo pdo_pgsql pgsql gd

# Cleaning up
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* var/tmp/*

# Add redis PHP extension
RUN pecl install -o -f redis && rm -rf /tmp/pear && docker-php-ext-enable redis

# Set default settings
COPY ./www.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./opcache.ini "$PHP_INI_DIR/conf.d/opcache.ini"
COPY ./memory_limit.ini "$PHP_INI_DIR/conf.d/docker-php-memlimit.ini"
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Configure and set a non-root user
ARG PUID=1000
ENV PUID ${PUID}
ARG PGID=1000
ENV PGID ${PGID}
RUN groupmod -o -g ${PGID} www-data && usermod -o -u ${PUID} -g www-data www-data
USER www-data:www-data

# Set a project work directory
WORKDIR /var/www/apps

EXPOSE 9000

CMD ["php-fpm"]