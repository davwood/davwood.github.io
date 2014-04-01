---
layout: post
title: "Getting a Spree Site onto Heroku"
date: 2014-03-10 09:29:44 +1100
comments: true
categories: technical,spree,heroku,ruby-on-rails
---

I had a great Spree E-commerce working fine on the localhost - and then I needed to get it onto heroku. Easy right? As someone who has used heroku a few times before (but not for a little while) I remembered it was pretty much a simple case of 'git push heroku master'. Nope!!

Below is some coverage of what I needed to do. Hopefully it can be of use.

This was using spree branch '2-2-stable' with a postgresql database.

Step 1: Update the web server to unicorn
----------------------------------------

Add the gem 'unicorn' and create a file 'config/unicorn.rb'. The put the below into the file:

	{% codeblock lang:ruby %}
	worker_processes Integer(ENV["WEB_CONCURRENCY"] || 3)
	timeout
	timeout 15
	preload_app true
	before_fork do |server, worker|
	  Signal.trap 'TERM' do
	    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
	    Process.kill 'QUIT', Process.pid
	  end
	  defined?(ActiveRecord::Base) and
	    ActiveRecord::Base.connection.disconnect!
	end
	after_fork do |server, worker|
	  Signal.trap 'TERM' do
	    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
	  end
	  defined?(ActiveRecord::Base) and
	    ActiveRecord::Base.establish_connection
	end
	{% endcodeblock %}

* create a Procfile in the root directory
* in the Procfile write:
{% codeblock %}
web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
{% endcodeblock %}
* create a .env file to hold environment variables and add it to .gitignore!

{% codeblock %}
echo "RACK_ENV=development" >>.env
echo "PORT=3000" >> .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "add .env to .gitignore"
{% endcodeblock %}

* gem install foreman
* foreman start

Now running unicorn! :)

Step 2: Rails App Config Updates
----------------------------------------

* Remove username from database.yml
 Production looks like:
{% codeblock %}
production:
	adapter: postgresql
	encoding: unicode
	database: rungazella_production
	pool: 5
	password:
{% endcodeblock %}

* I entered in config/applications.rb
{% codeblock %}
config.assets.initialize_on_precompile = false
{% endcodeblock %}
but i read this is outdated and isn’t used anymore          

I also changed config/environments/production.rb to
{% codeblock %}
config.serve_static_assets = true
{% endcodeblock %}
not sure if it did anything          

Step 3: Login to heroku
-----------------------

1. If haven’t already setup a login to heroku. then login with heroku login
2. heroku create
3. add postgresql to your app. you can type: heroku addons:add heroku-postgresql but I had to add it within the heroku web interface. add-ons section.
4. Then use the user-env-compile from heroku labs labs:enable user-env-compile -a my app

Step 4: Final Deploy
--------------------

There is currently a known problem with spree and pushing it to heroku. 
https://github.com/spree/spree/issues/3749; https://github.com/spree/spree/issues/3688
This means using the user-env-compile (point 4) above and pre-compiling assets before pushing to heroku.
Some info here: https://devcenter.heroku.com/articles/rails-asset-pipeline
Follow the steps below.

1. bundle exec rake assets:precompile RAILS_ENV=production
2. git add .
3. git commit -m “recompiling assets”
4. git push origin master
5. git push heroku master
6. heroku run rake db:migrate --app my-app
7. heroku restart --app my-app

Step 5: Setup the admin user
----------------------------
          
{% codeblock %}
heroku run rails console
user = Spree::User.create!(:email => “admin@rungazella.com", :password => "yourpassword")
user.spree_roles.create!(:name => "admin")
{% endcodeblock %}
