var db = require('../../db/models'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = db.User;
const fs = require('fs');


exports.create_account = (req, res) => {
    console.log(req.body)
    // need check duplicate

    // create
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        hash_password: bcrypt.hashSync(req.body.password, 10),
        status: 1
    }).then(newUser => {
        newUser.hash_password = undefined;
        newUser.status = "OK";
        newUser.message = "create account is successful"
        return res.json(newUser);
    }).catch(error => {
        console.log(error)
        return res.status(400).send({
            status: "ERROR",
            code: "ACC003",
            message: "Error. Can't create new account"
        });
    })
}

exports.login = (req, res) => {
    console.log("Login "+JSON.stringify(req.body))
    try {
        User.findOne({
            where:{phone: req.body.phone}
        }).then(user=>{
            if (!user) {
                return res.status(401).json({ status: "ERROR", code: "ACC001", message: 'Authentication failed. User not found.' });
            } else if (user) {
                if (!bcrypt.compareSync(req.body.password, user.hash_password)) {
                    return res.status(401).json({ status: "ERROR", code: "ACC002", message: 'Authentication failed. Wrong password.' });
                } else {
                    let privateKey = fs.readFileSync('./key/myKey.pem')
                    jwt.sign(
                        { 
                            phone: user.phone, 
                            username: user.username, 
                            user_id: user.id,
                            random: bcrypt.hashSync(Date.now().toString(), 10)
                        }, 
                        privateKey,
                        {
                            expiresIn: '1d',
                            algorithm: 'RS256'
                        },
                        (err, token) =>{
                            if(err){
                                console.log(err);
                                return res.json({
                                    status: "ERROR", code: "ACC003", message: 'Sign token is failed'
                                })
                            }else{
                                user.update({ token: token }).then(()=>{
                                    return res.json({token: token });
                                }).catch(error=>{
                                    console.log(error)
                                    return res.json({token:null})
                                })
                            }
                        }
                    );
                }
            }
        }).catch(error=>{
            console.log(error)
        })
    } catch (error) {
        console.log(error)
    }
}

exports.logout = (req, res) => {
    console.log("Logout")
    try {
        User.findOne({
            where:{id: req.user.user_id}
        }).then(user=>{
            if (!user) {
                res.status(401).json({ status: "ERROR", code: "ACC001", message: 'Authentication failed. User not found.' });
            } else if (user) {
                user.update({ token: null }).then(() => {
                    return res.json({ status: "OK", message: "Logout is successful" });
                }).catch(error => {
                    console.log(error)
                    return res.json({ status: "ERROR", code: "ACC013", message: "Logout is failed" })
                })
            }
        }).catch(error=>{
            console.log(error)
        })
    } catch (error) {
        console.log(error)
    }
}

exports.loginRequired = function (req, res, next) {
    try {
        if (req.user) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized user!' });
        }
    } catch (error) {
        console.log(error)
    }
};

exports.change_password = (req, res) => {
    try {
        User.findOne({
            where:{id: req.user.user_id}
        }).then(user => {
            user.update({ hash_password: bcrypt.hashSync(req.body.new_password, 10) })
                .then(() => {
                    return res.json({
                        status: "OK",
                        message: "Change password is successful"
                    })
                }).catch(error => {
                    console.log(error)
                    return res.json({
                        status: "ERROR",
                        message: "Change password is failed. Error: update database fail",
                        code:"ACC031"                    
                    })
                })
        }).catch(error => {
            console.log(error)
            return res.json({
                status: "ERROR",
                message: "Change password is failed. Error: Can't find account",
                code: "ACC032"
            })
        })
    } catch (error) {
        console.log(error)
    }
}

