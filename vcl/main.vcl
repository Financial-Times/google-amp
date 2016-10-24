sub vcl_recv {
#FASTLY recv
	if (req.request != "HEAD" && req.request != "GET" && req.request != "FASTLYPURGE") {
		return(pass);
	}

	if (req.http.x-geoip-override) {
		set geoip.ip_override = req.http.x-geoip-override;
	}

	if (!req.http.country-code) {
		set req.http.country-code = geoip.country_code3;
	}

	if (!req.http.country-code-two-letters) {
		set req.http.country-code-two-letters = geoip.country_code;
	}

	if (!req.http.continent_code) {
		set req.http.continent_code = geoip.continent_code;
	}

	if (!req.http.ft-allocation-id && req.http.Cookie ~ "(^|; *)FTAllocation=([^;]+).*$") {
		set req.http.ft-allocation-id = re.group.2;
	}

	if (!req.http.ft-session-id && req.http.Cookie ~ "(^|; *)FTSession=([^;]+).*$") {
		set req.http.ft-session-id = re.group.2;
	}

	return(lookup);
}

sub vcl_fetch {
#FASTLY fetch

	if ((beresp.status == 500 || beresp.status == 503) && req.restarts < 1 && (req.request == "GET" || req.request == "HEAD")) {
		restart;
	}

	if(req.restarts > 0 ) {
		set beresp.http.Fastly-Restarts = req.restarts;
	}

	if (beresp.http.Set-Cookie) {
		set req.http.Fastly-Cachetype = "SETCOOKIE";
		return (pass);
	}

	if (beresp.http.Cache-Control ~ "private") {
		set req.http.Fastly-Cachetype = "PRIVATE";
		return (pass);
	}

	if (beresp.status == 500 || beresp.status == 503) {
		set req.http.Fastly-Cachetype = "ERROR";
		set beresp.ttl = 1s;
		set beresp.grace = 5s;
		return (deliver);
	}

	if (beresp.http.Expires || beresp.http.Surrogate-Control ~ "max-age" || beresp.http.Cache-Control ~"(s-maxage|max-age)") {
		# keep the ttl here
	} else {
		# apply the default ttl
		set beresp.ttl = 3600s;
	}

	return(deliver);
}

sub vcl_hit {
#FASTLY hit

	if (!obj.cacheable) {
		return(pass);
	}
	return(deliver);
}

sub vcl_miss {
#FASTLY miss
	return(fetch);
}

sub vcl_deliver {
#FASTLY deliver
	return(deliver);
}

sub vcl_error {
#FASTLY error
}

sub vcl_pass {
#FASTLY pass
}
