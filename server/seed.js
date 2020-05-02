const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/UTMSmart', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}, (err) => {
  if (err) {
    console.log('Error connecting to database.');
  }
});

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


// // seed dummy data

Student.countDocuments({}, (err, count) => {
  if (count == 0) {
    Student.insertMany([{
      Name: 'Abu',
      MatricNo: 'A172'
    }, {
      Name: 'Bob',
      MatricNo: 'A171'
    }]);

    const lecturer = new Lecturer({
      _id: mongoose.Types.ObjectId(),
      Name: 'Alex'
    });

    const currentCourse = new CurrentCourse({
      _id: mongoose.Types.ObjectId(),
      Name: 'Business Intelligence',
      Code: 'SCSP 2020',
      Credit: 3,
      NumberOfStudent: 36,
      Section: 1,
      Lecturer: lecturer._id
    });

    const currentCourse2 = new CurrentCourse({
      _id: mongoose.Types.ObjectId(),
      Name: 'Business Intelligence',
      Code: 'SCSP 2020',
      Credit: 3,
      NumberOfStudent: 36,
      Section: 1,
      Lecturer: lecturer._id
    });
    lecturer.save();
    currentCourse.save();
    currentCourse2.save();

  }
});

