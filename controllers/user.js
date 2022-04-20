const {handleResponse, getCleanUser, generateToken, generateRefreshToken, refreshTokens, COOKIE_OPTIONS, clearTokens} = require("../utils");
const {userList} = require("../userList");

// validate user credentials
exports.login =(
    function (req,res){
        const user = req.body.username;
        const pwd = req.body.password;

        // return 400 status if username/password is not exist
        if (!user || !pwd) {
            return handleResponse(req, res, 400, null, "Username and Password required.");
        }

        const userData = userList.find(x => x.username === user && x.password === pwd);

        // return 401 status if the credential is not matched
        if (!userData) {
            return handleResponse(req, res, 401, null, "Username or Password is Wrong.");
        }

        // get basic user details
        const userObj = getCleanUser(userData);

        // generate access token
        const tokenObj = generateToken(userData);

        // generate refresh token
        const refreshToken = generateRefreshToken(userObj.userId);

        // refresh token list to manage the xsrf token
        refreshTokens[refreshToken] = tokenObj.xsrfToken;

        // set cookies
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

        return handleResponse(req, res, 200, {
            user: userObj,
            token: tokenObj.token,
            expiredAt: tokenObj.expiredAt
        });
    }
);

// handle user logout
exports.logout = (
    function (req, res) {
        clearTokens(req, res);
        return handleResponse(req, res, 200, "User logout successfully.");
    }
)