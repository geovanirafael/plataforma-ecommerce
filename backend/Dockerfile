FROM php:8.3-fpm

# Dependências do sistema necessárias para as extensões PHP e para o Composer
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Composer instalado via imagem oficial (multi-stage copy, sem precisar de curl+php extra)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache-custom.ini

WORKDIR /var/www

# As dependências (composer.json) só são copiadas e instaladas depois de existir
# um projeto Laravel real — no primeiro arranque, o container serve só para
# rodar `composer create-project`.

EXPOSE 9000

CMD ["php-fpm"]
