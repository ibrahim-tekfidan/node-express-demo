const express = require('express');
const router = express.Router();
const Joi = require('joi');

// For demo we are using array of objects instead of using database.
const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

// We wanna implement couple of endpoint that reponse to the http get request
// This method takes 2 arguments.
// First argument is the path or the url
// The second argument is the callback function. This is the function that will be call when we have a http get request to given endpoint
// req object has a bunch of useful properties that gives us information about the incoming request. If you wanna learn these properties, it's best the look at the express documentation

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with the given ID was not found.');
    return;
  }
  res.send(course);
});

router.post('/', (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.message);
    return; // Because we don't want to rest of the function to be executed.
  }

  const course = {
    id: courses.length + 1, // We don't have database so we need to add id manually.
    name: req.body.name, // In order to this line work we need to enable parsing of json object in the body of the request => app.use(express.json())
  };
  courses.push(course);
  res.send(course); // The reason for this is because we are assigning id on the server in real-world applications. So we need to return the course object to the client because maybe client needs to know id of the object.
});

router.put('/:id', (req, res) => {
  // Look up to course
  // If not existing, return 404 - Resource not found

  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with given ID was not found.');
    return;
  }

  // Validate
  // If invalid, return 400 - Bad request

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.message);
    return; // Because we don't want to rest of the function to be executed.
  }

  // Update Course
  // return updated course
  course.name = req.body.name;
  res.send(course);
});

router.delete('/:id', (req, res) => {
  // Look up the course
  // Not existing, return 404 - Resources not found
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with the given ID was not found.');
    return;
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

module.exports = router;
