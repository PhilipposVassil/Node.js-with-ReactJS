const {handleResponse, refreshTokens, verifyToken, getCleanUser, generateToken} = require("../utils");
const {userList} = require("../userList");

// verify the token and return new tokens if it's valid
exports.verifyToken =(
    function (req, res) {

        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
        if (!refreshToken) {
            return handleResponse(req, res, 204);
        }

        // verify xsrf token
        const xsrfToken = req.headers['x-xsrf-token'];
        if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
            return handleResponse(req, res, 401);
        }

        // verify refresh token
        verifyToken(refreshToken, '', (err, payload) => {
            if (err) {
                return handleResponse(req, res, 401);
            }
            else {
                const userData = userList.find(x => x.userId === payload.userId);
                if (!userData) {
                    return handleResponse(req, res, 401);
                }

                // get basic user details
                const userObj = getCleanUser(userData);

                // generate access token
                const tokenObj = generateToken(userData);

                // refresh token list to manage the xsrf token
                refreshTokens[refreshToken] = tokenObj.xsrfToken;
                res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

                // return the token along with user details
                return handleResponse(req, res, 200, {
                    user: userObj,
                    token: tokenObj.token,
                    expiredAt: tokenObj.expiredAt
                });
            }
        });
    }
);