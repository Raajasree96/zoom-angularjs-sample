var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/app'));

app.use(
	express.static(__dirname + '/public', {
		index: 'home.html',
		maxAge: '2h' // Now index.html will not be exposed on default access
	})
);

app.use(function(req, res, next) {
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
	next();
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
