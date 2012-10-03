source 'https://rubygems.org'

ruby '1.9.3'
gem 'rails', '3.2.2'
gem "haml-rails"
gem 'formtastic'
gem "mongoid", :git => "https://github.com/mongoid/mongoid.git"
gem 'bson_ext'
gem "jquery-rails"
gem 'rmagick', '2.12.0', :require => 'RMagick'
gem 'rack-cache', :require => 'rack/cache'
gem 'kaminari'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'



# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer'

  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :production do
  gem 'pg'
end

group :development, :test do
  gem 'sqlite3'
  gem "rspec-rails", "~> 2.0"
  gem 'ZenTest'
  gem 'pry'
  gem 'pry-nav'
end

group :test do
  gem 'database_cleaner', require: false
  gem 'spork'
end
