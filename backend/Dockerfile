FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    $PHPIZE_DEPS \
    postgresql-dev \
    oniguruma-dev \
    freetype-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zip \
    unzip \
    git \
    curl \
    supervisor


RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pgsql \
    bcmath \
    mbstring \
    gd \
    opcache

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first (layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies (no scripts, no autoload yet)
RUN composer install --no-interaction --no-scripts --no-autoloader --prefer-dist

# Copy rest of the application
COPY . .

# Finalize composer (autoload + scripts)
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy supervisord config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy PHP-FPM config override
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

EXPOSE 9000

RUN mkdir -p /var/log/supervisor \
    && chown -R www-data:www-data /var/log/supervisor

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
