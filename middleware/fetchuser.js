const jwt = require('jsonwebtoken');
const JWT_SCRET = 'Robinisgood$oy'

const fetchUser = (req, res, next) => {
    //Get the user from the JWT tocket and add id to req object
    const tocken = req.header('auth-tocken');
    if (!tocken) {
        res.status(401).send({ error: "Please authrise using a robin vlaid tocken" })
    }

    try {
        const data = jwt.verify(tocken, JWT_SCRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Tocken couldnot process" })
    }
}

module.exports = fetchUser;
 