---
layout: post
title: "Adventures with Spree Commerce"
date: 2014-02-27 08:43:02 +1100
comments: true
categories: technical,spree,ruby-on-rails
---

I've been busy lately working on a [Spree](http://spreecommerce.com/) E-Commerce site. Spree commerce is an open source ruby on rails project that is very active with lots of users and information. The basic spree gem isn't going to be enough for most people to get a useful site up and running. Fortunately there are lots of extensions that can be added in to get you most of the way there.


In my implementation so far I have used the following gems (in addition to the standard gateway and devise):

* [spree-blogging-spree](https://github.com/stefansenk/spree-blogging-spree) - a simple implementation of a blog within spree. More useful than integrating wordpress for example as it uses a shared database.
* [spree_editor](https://github.com/spree/spree_editor) - allows a rich text interface for the blog
* [spree_print_invoice](https://github.com/spree/spree_print_invoice) - allows you to generate (and customise) a PDF invoice. Was surprised that this wasn't standard.
* [spree_product_zoom](https://github.com/spree/spree_product_zoom) - integrates lightbox zoom functionality so you can show your product images better.
* [spree_boostrap_frontened](https://github.com/200Creative/spree_bootstrap_frontend) - switches out the skeleton framework used by spree to the bootstrap framework. I used this so I could have better access to all the bootstrap components as I'm already familiar will this.

I have found Spree to be an excellent project to use but I certainly had a steep learning curve to get up to speed with Spree and then to understand configuring each and every gem to be used above. So would definitely recommend Spree to fellow ruby on rails developers and anyone else if you are keen to learn and have enough time. There is some good documentation on the [Spree](http://guides.spreecommerce.com/) site but lacking as you delve too deep.

It is full scale enterprise solution so not something to take on for a quick job.

That said - it will be a lot quicker next time to begin with the gems above and then create a theme from there.


