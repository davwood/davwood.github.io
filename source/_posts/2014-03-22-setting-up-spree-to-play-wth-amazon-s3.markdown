---
layout: post
title: "Setting up Spree to play with Amazon S3"
date: 2014-03-22 10:23:01 +1100
comments: true
categories: technical, spree, S3, ruby-on-rails
---

{% img images/amazon-river.jpg 600 200 Amazon %}

S3 is needed to host images when using heroku or other similar services (like ninefold). This is because heroku’s filesystem is readonly, so when uploading images (except with deploy) we need to use an off-site sever such as S3.

Spree used to have S3 configurable as part of the admin back end. 
However, Spree in 2-2-stable has now dropped this integration.
https://github.com/spree/spree/commit/b1d6c5e4b9801d888cc76c05116b814945122207
We must refer to the paperclip documentation instead.
https://github.com/thoughtbot/paperclip

But spree has some config options available within initializers/spree.rb
see below:

{% codeblock lang:ruby %}
Spree.config do |config|
       # Example:
       # Uncomment to override the default site name.
       config.site_name = "Gazella Running Costumes"
       config.logo = "store/rungazella.png"

      #S3 configuration
      if Rails.env.production? then
           #production. Store images on S3.
           # development will default to local storage
          attachment_config = {
          s3_credentials: {
            access_key_id: ENV["S3_KEY"],
            secret_access_key: ENV["S3_SECRET"],
            bucket: ENV["S3_BUCKET"],
          },


          storage:        :s3,
          s3_headers:     { "Cache-Control" => "max-age=31557600" },
          s3_protocol:    "https",
          bucket:         ENV["S3_BUCKET"],

          path:          ":rails_root/public/:class/:attachment/:id/:style/:basename.:extension",
          default_url:   "/:class/:attachment/:id/:style/:basename.:extension",
          default_style: "product",
          }

          attachment_config.each do |key, value|
               Spree::Image.attachment_definitions[:attachment][key.to_sym] = value
          end
     end
end
Spree.user_class = "Spree::User"
end
{% endcodeblock %}

note: the environmental variables were then added to heroku using 
{% codeblock %}
heroku config:set S3_KEY=your_access_key
heroku config:set S3_SECRET=your_secret_key
heroku config:set S3_BUCKET=your_bucket_name
{% endcodeblock %} 

### Additional Notes:

Update to the paperclip defaults for image sizes
http://guides.spreecommerce.com/developer/logic.html

To change the paperclip defaults for image sizes I created the file app/models/spree/image_decorator.rb. And added this:
{% codeblock lang:ruby %}
Spree::Image.class_eval do
  attachment_definitions[:attachment][:styles] = {
    mini:     "50x60>", #used for the thumbnails
	small:    "120x144>", #used for the product listing
	product:  "300x361>", #used for the main product page
	large:    "700x841>" #could be used for hovering
  }
end
{% endcodeblock %}

Uploading Images with Ckeditor
------------------------------

I had naively thought that updating the above would allow also work for the blog I had added to my site using the [spree-blogging-spree](https://github.com/stefansenk/spree-blogging-spree) gem. Unfortunately ckeditor didn't recognise spree straight away but it can be configured with paperclip.

Based on this I could update app/models/ckeditor/picture.rb to:

{% codeblock lang:ruby %}
class Ckeditor::Picture < Ckeditor::Asset
  has_attached_file :data,
                    styles: { :content => '600>', :thumb => '118x100#' },
   s3_credentials: {
		  access_key_id: ENV["S3_KEY"],
		  secret_access_key: ENV["S3_SECRET"],
		  bucket: ENV["S3_BUCKET"],
		},
	storage: :s3,
	s3_headers:     { "Cache-Control" => "max-age=31557600" },
	s3_protocol:    "https",
	bucket:         ENV["S3_BUCKET"],
    path: "/:class/:attachment/:id/:style/:basename.:extension",
	default_url:   "/:class/:attachment/:id/:style/:basename.:extension",
	default_style: "medium"

  validates_attachment_size :data, :less_than => 2.megabytes
  validates_attachment_presence :data

  def url_content
    url(:content)
  end
end
{% endcodeblock %}