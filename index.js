const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mustacheExpress = require('mustache-express');
app.engine('htm', mustacheExpress());
app.set('views', './');
app.set('view engine', 'htm');
app.get('/', (req, res) => {
	if (req.get('X-Replit-User-Id')) {
    // Templating time!
		res.render('welcome', {
      userid: req.get('X-Replit-User-Id'),
      username: req.get('X-Replit-User-Name'),
      userroles: req.get('X-Replit-User-Roles'),
			url: req.query.url
    });
	} else {
    // Log-in prompt.
		res.sendFile(__dirname+"/new.html");
	}
});
app.get('/welcome.js', (req, res) => {
	res.sendFile(__dirname+"/welcome.js");
});
/// Listening */
app.listen(8080);