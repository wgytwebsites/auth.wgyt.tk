const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mustacheExpress = require('mustache-express');
app.engine('htm', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'htm');
// you can go to / to show index.html
app.get('/', (req, res) => {
	url = req.query.url
		res.render('index', {
			url: url
    });
});
// you can go to /repl to show repl it login
app.get('/repl', (req, res) => {
	if (req.get('X-Replit-User-Id')) {
    // Templating time!
		res.render('welcome', {
      userid: req.get('X-Replit-User-Id'),
      username: req.get('X-Replit-User-Name'),
      userroles: req.get('X-Replit-User-Roles'),
			url: url
    });
	} else {
    // Log-in prompt.
		res.sendFile(__dirname+"/views/new.htm");
	}
});
/// Listening */
app.listen(8080);