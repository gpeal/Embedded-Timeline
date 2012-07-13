import webapp2
import logging
from google.appengine.ext.webapp import template
import os

class MainPage(webapp2.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), 'html/timeline.html')
		self.response.out.write(template.render(path, {}))
		logging.debug('request: ' + self.request.path_url)
		if(self.request.get('spongeFile') is not ''):
			sponge_url = 'http%3A//sponge.corp.google.com/largeText%3FinvocationId%3D9601ac85-7940-4bb8-a7d1-0b92f66d72b9%26targetResultIndex%3D0%26largeTextIndex%3D2%26format%3Dstreamed%26zipEntry%3D'
			#sponge_url = 'google.com/'
			self.redirect('/?url=' + \
				 sponge_url + \
				self.request.get('spongeFile'))

app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
