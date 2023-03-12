const User = require("../../models/user.js");
const bcrypt = require("bcrypt");
const MongoClient = require("mongodb").MongoClient;

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, role, password, confirmPass } = req.body;
      try {
        const emailExists = await User.countDocuments({ email });

        if (emailExists > 0) {
          return res.render("auth/register", {
            errorMessage: "This Email already exists !",
            name,
            email,
          });
        }

        if (password != confirmPass) {
          return res.render("auth/register", {
            errorMessage: "Passwords don't match !",
            name,
            email,
          });
        } else {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const registerUser = new User({
            name,
            email,
            password: `${hashedPassword}`,
            role,
          });

          const registered = await registerUser.save();
          req.session.name = name;
          req.session.customerId = registerUser._id;
          res.redirect(302, "/");
        }
      } catch (err) {
        console.log(err);
        return res.render("auth/register", {
          errorMessage: "Some error Occured in registering the user",
          name,
          email,
        });
      }
    },
    async postLogin(req, res) {
      const useremail = req.body.email;
      const pass = req.body.password;

      try {
        const user = await User.findOne({ email: useremail }).select(
          "password name"
        );

        if (!user) {
          console.log("User not found");
          return res.status(502).render("auth/login", {
            errorMessage: "User Not Found ",
            email,
          });
        }

        const valid_pass = user.password;
        const isMatched = await bcrypt.compare(pass, valid_pass);

        if (isMatched === true) {
          req.session.name = user.name;
          req.session.customerId = user._id;

          res.redirect(302, "/");
        } else {
          return res.render("auth/login", {
            errorMessage: "Invalid Email or Password",
            email,
          });
        }
      } catch (err) {
        console.log(err, "Error in Logging In");
        return res.status(404).render("auth/login", {
          errorMessage: "Some error Occured in Logging the user",
          email,
        });
      }
    },

    async logout(req, res) {
      console.log(req.sessionStore.options.uri);

      const curr_customerId = req.session.customerId;

      const uri = req.sessionStore.options.uri;

      // Create a new MongoClient instance.
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Connect to the MongoClient.

      client
        .connect()
        .then(async() => {
          console.log("Connected to MongoDB");
          // Perform database operations here
          const db = client.db("Restaurant");
          const sessionsCollection = db.collection("sessions");

          const result = await sessionsCollection.deleteOne({ 'session.customerId': curr_customerId }) ;
            
          console.log('Session Deleted') ; 

          // Close the MongoClient.
          client.close();

          res.redirect(302, "/");
        })
        .catch((err) => {
          console.log(err , 'Error in LOGOUT IN AUTH-CONTROLLER');
          res.redirect("home" , {message:"Error in Logging Out" , name:req.session.name});
        });

      
    },
  };
}

module.exports = authController;
