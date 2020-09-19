var express = require("express");
var router = express.Router();
var dbData = require("../db-data.json");
const util = require("util");

function pagination(data, page = 1, limit = 20) {
  const start = limit * page - limit;
  const end = start + (limit - 1);
  const pageData = [];

  data.forEach((data, index) => {
    if (index >= start && index <= end) {
      pageData.push(data);
    }
  });

  return pageData;
}

function getDataByDate(responseData, selectedDate) {
  const month = new Date(selectedDate).getMonth();
  const year = new Date(selectedDate).getFullYear();

  return responseData.filter((workout) => {
    const workoutMonth = new Date(workout.startDate).getMonth();
    const workoutYear = new Date(workout.startDate).getFullYear();

    return workoutMonth === month && workoutYear === year;
  });
}

/* GET workouts. */
router.get("/", function (req, res, next) {
  // sort random data by date
  dbData.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));

  let responseData = dbData;
  let workoutDate = null;
  let page = 1;
  let limit = 20;

  const pageItems = pagination(responseData, page);

  const body = {
    data: {
      page,
      totalPages: Math.ceil(responseData.length / limit),
      categories: null,
      startDate: workoutDate,
      items: pageItems,
      totalItems: responseData.length,
    },
  };

  res.send(body);
});

router.post("/", function (req, res, next) {
  // sort random data by date
  dbData.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));

  let responseData = dbData;
  let workoutDate = null;
  let page = 1;
  let limit = 20;

  if (req.body) {
    const body = req.body;

    if (body.page) page = parseInt(body.page);

    if (body.startDate) {
      workoutDate = body.startDate;
      responseData = getDataByDate(responseData, workoutDate);
    }

    if (body.categories) {
      const checkedTrue = body.categories.find((category) => {
        return category.checked;
      });

      if (checkedTrue) {
        responseData = responseData.filter((workout) => {
          const foundCategory = body.categories.find((category) => {
            return category.name === workout.category;
          });

          return foundCategory.checked === true;
        });
      }
    }
  }

  const pageItems = pagination(responseData, page);

  const body = {
    data: {
      page,
      totalPages: Math.ceil(responseData.length / limit),
      categories: null,
      startDate: workoutDate,
      items: pageItems,
      totalItems: responseData.length,
    },
  };

  res.send(body);
});

module.exports = router;
