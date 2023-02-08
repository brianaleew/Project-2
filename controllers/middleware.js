//Middleware: checking to make sure user is logged in and redirecting if they arent
const auth = (req, res, next) => {
	if (req.session.loggedIn) {
		next()
	} else {
		res.redirect('/auth/login')
	}
}

module.exports = { auth }
