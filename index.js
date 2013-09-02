var _ = require('underscore'),
	path = require('path'),
	url = require('url');


module.exports = function(options) {
	var absoluteUrl = function() {
		var absoluteUrl = {
			'protocol': this.protocol,
			'hostname': this.host,
			'port': this.app.settings.port,
			'pathname': this.url
		}; 

		if(this.app.get('basePath'))
			absoluteUrl.pathname = path.join(this.app.get('basePath'), absoluteUrl.pathname);

		if(this.app.get('trust proxy')) {
			if(!_.isUndefined(this.headers['x-forwarded-proto']))
				absoluteUrl.protocol = this.headers['x-forwarded-proto'];

			if(!_.isUndefined(this.headers['x-forwarded-host']))
				absoluteUrl.hostname = this.headers['x-forwarded-host'];

			if(!_.isUndefined(this.headers['x-forwarded-port']))
				absoluteUrl.port = this.headers['x-forwarded-port'];
		}

		if((absoluteUrl.protocol == 'http' && absoluteUrl.port == 80) || (absoluteUrl.protocol == 'https' && absoluteUrl.port == 443))
			absoluteUrl.port = '';

		return url.format(absoluteUrl);
	};

	return function(req, res, next) {
		if(!_.isUndefined(options.absoluteUrl) && options.absoluteUrl)
			req.absoluteUrl = absoluteUrl;

		if(!_.isUndefined(options.defaultSessionParameters)) {
			for(var parameter in options.defaultSessionParameters) {
				if(_.isUndefined(req.session[parameter]))
					req.session[parameter] = options.defaultSessionParameters[parameter];
			}
		}

		next();
	};
};
