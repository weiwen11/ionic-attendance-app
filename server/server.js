const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// database name UTMSmart
mongoose.connect('mongodb://localhost/UTMSmart', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}, (err) => {
  if (err) {
    console.log('Error connecting to database.');
  }
});

app.use(morgan('dev')); // log requests in terminal
app.use(bodyParser.urlencoded({ extended: true })); // parse form
app.use(bodyParser.json()); // parse json
app.set('view engine', 'ejs'); // for serving html directly (for website part)

// allow ionic to GET/POST this server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(express.static('public'));

// routes for website
app.get('/examplepage', (req, res) => { // visit http://localhost:8080/examplepage
  res.render('examplepage'); // will serve views/examplepage.ejs file
});

app.get('/example/anotherpage', (req, res) => { // http://localhost:8080/example/anotherpage
  res.render('anotherpage');
});

app.get('/lecturer', (req, res) => {
  res.render('lecturer');
});

app.get('/lecturer/attendance', (req, res) => {
  res.render('attendance');
});

app.get('/attendanceScan/:key', (req, res) => {
  Attendance.findOne({ key: req.params.key })
    .populate('Lecturer')
    .populate('CurrentCourse')
    .exec()
    .then(doc => {
      res.render('attendanceScan', {
        key: req.params.key,
        title: doc.CurrentCourse.Name,
        code: doc.CurrentCourse.Code,
        lect: doc.Lecturer.Name,
        timeStart: doc.TimeStart,
        timeStop: doc.TimeStop
      });

    });
});

// routes to serve json for both ionic and website
app.get('/api/msg', (req, res) => {
  res.status(200).json({ msg: 'hello' });
});

app.post('/api/form', (req, res) => {
  console.log(req.body.testing);
  res.status(200).json({ msg: 'message received: ' + req.body.testing });
});

app.get('/api/lecturer/getCurrentCourse', (req, res) => {
  Lecturer.findOne({ Name: 'Alex' }).exec()
    .then(doc => {
      CurrentCourse.find({ Lecturer: doc._id }).exec()
        .then(docs => {
          res.status(200).json(docs);
        });
    });
});

app.post('/api/lecturer/startAttendance', (req, res) => {
  Lecturer.findOne({ Name: 'Alex' }).exec()
    .then(doc => {
      Attendance.create({
        Lecturer: doc._id,
        CurrentCourse: req.body.courseID,
        TimeStart: Date.now(),
        TimeStop: Date.now() + 1000 * 60 * 15,
        key: makeid(6)
      }, (err, result) => {
        Attendance.findById(result._id)
          .populate('Lecturer')
          .populate('CurrentCourse')
          .exec()
          .then(att => {
            res.status(200).json(att);
          });
      });
    });
});

app.get('/api/lecturer/attendance', (req, res) => {
  Lecturer.findOne({ Name: 'Alex' }).exec()
    .then(doc => {
      Attendance.find({ Lecturer: doc._id })
        .populate('Lecturer')
        .populate('CurrentCourse')
        .exec()
        .then(docs => {
          res.status(200).json(docs);
        });
    });
});


// server start
app.listen(8080, () => console.log('app listening on port 8080'));


// mongoose models
const Attendance = mongoose.model('Attendance', {
  Lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true
  },
  CurrentCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CurrentCourse',
    required: true
  },
  TimeStart: { type: Number, required: true },
  TimeStop: { type: Number, required: true },
  key: { type: String, required: true }
});

const StudentAttendance = mongoose.model('StudentAttendance', {
  Attendance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance',
    required: true
  },
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  Attended: { type: String, required: true }
});

// demo student model from other group
const Student = mongoose.model('Student', {
  Name: { type: String, required: true },
  MatricNo: { type: String, required: true }
});

// demo course model from other group
const CurrentCourse = mongoose.model('CurrentCourse', {
  Name: { type: String, required: true },
  Code: { type: String, required: true },
  Credit: { type: Number, required: true },
  NumberOfStudent: { type: Number, required: true },
  Section: { type: Number, required: true },
  Lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true
  }
});

// demo lecturer model from other group
const Lecturer = mongoose.model('Lecturer', {
  Name: { type: String, required: true },
});

const LecturerAttendance = mongoose.model('LecturerAttendance', {
  Lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true
  },
  PunchTime: { type: Number, required: true },
  IsPunchIn: { type: Boolean, required: true }
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
