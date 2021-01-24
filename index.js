const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
const mustacheExpress = require('mustache-express');
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({
	extended: false
}))
var urlencodedParser = bodyParser.urlencoded({
	extended: false
})
app.use(cookieParser());
app.engine('html', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'html');
// google auth id token setup
const {
	OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.googleAppUrl);
// redirect to v0
app.get('/', (req, res) => {
	res.set('location', '/v0/get?url=' + req.query.url);
	res.status(301).send()
});
app.get('/repl', (req, res) => {
	res.set('location', '/v0/get/repl?url=' + req.query.url);
	res.status(301).send()
});
// v0 api
app.get('/v0/get/', (req, res) => {
	url = req.query.url
	res.render('index', {
		url: url
	});
});
app.get('/v0/get/repl', (req, res) => {
	if (req.get('X-Replit-User-Id')) {
		res.render('welcome', {
			userid: req.get('X-Replit-User-Id')
			, username: req.get('X-Replit-User-Name')
			, userroles: req.get('X-Replit-User-Roles')
			, url: req.query.url
		});
	} else {
		res.sendFile(__dirname + "/views/new.html");
	}
});
// v1 beta api
app.get('/v1/json/', (req, res) => {
	// paramater test url: https://auth.wgyt.tk/v1/json?redirectURL=wgyt&postDataURL=wgyt&whatDataOBJ=%22name%22:true,%22id%22:true,%22roles%22:true&plfmTypeOBJ=%22replit%22:true&appNameSTRG=wgyt&appMailSTRG=wgyt@wgyt.tk&appDvlpSTRG=wgyt
	res.send(`{
    "redirectURL":"${req.query.redirectURL}",
    "postDataURL":"${req.query.postDataURL}",
    "whatDataOBJ":{${req.query.whatDataOBJ}},
    "plfmTypeOBJ":{${req.query.plfmTypeOBJ}},
    "appNameSTRG":"${req.query.appNameSTRG}",
    "appMailSTRG":"${req.query.appMailSTRG}",
    "appDvlpSTRG":"${req.query.appDvlpSTRG}",
    "timestamp":${Date.now()}
  }`)
});
app.get('/v1', (req, res) => {
	// TODO: SET UP SETTINGS USING ABOVE PARAMATERS
	res.sendFile(__dirname + "/views/index-v1.html");
});
app.post('/v1/backend/google', urlencodedParser, (req) => {
	// google verify id token first
	var PAYLOAD
	async function verify(idtoken) {
		const ticket = await client.verifyIdToken({
			idToken: idtoken
			, audience: process.env.googleAppUrl
		, });
		// get google payload
		payload = ticket.getPayload()
			// TODO: RETURN THE PAYLOAD TO THE CLIENT TO POST THE SERVER OR DO IT HERE //
	}
	verify(req.body.idtoken).catch(console.error)
		// req.body.idtoken is sent by the client in views/index-v1.html in the onSignIn function
});
app.get('/v1/backend/github', (req, res) => {
	res.send(`{"code":"${req.query.code}"}`);
	// state is req.query.state
	// code is req.query.code
	// todo: do https://docs.github.com/en/developers/apps/identifying-and-authorizing-users-for-github-apps#2-users-are-redirected-back-to-your-site-by-github
});
app.listen(8080);
