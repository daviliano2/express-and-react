var express = require('express');
var router = express.Router();
var dbData = require('../db-data.json');
const util = require('util')


function pagination(data, page = 1, limit = 20) {
  const start = (limit * page) - limit;
  const end = start + (limit - 1);
  const pageData = []

  data.forEach((data, index) => {
    if (index >= start && index <= end) {
      pageData.push(data)
    }
  })

  return pageData
}

// TODO: remove this router.param methods
router.param('page', function (req, res, next, page) {
  console.log('PAGE CALLED ONLY ONCE')
  next()
})
router.param('date', function (req, res, next, date) {
  console.log('date CALLED ONLY ONCE')
  next()
})

/* GET workouts. */
router.get('/:page?/:date?', function(req, res, next) {
  // sort random data by date
  dbData.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
  
  let page = 1
  if (req.params.page) {
    page = parseInt(req.params.page)
  }
  console.log(req.params)
  console.log(page)

  const testData = [dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1],dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1], dbData[1]]
  const totalItems = testData.length

  const pageItems = pagination(testData, page);

  const body = {
    data: {
      page,
      totalPages: Math.ceil(testData.length / 20), // 20 is the default limit, this could be changed to be dynamic
      category: null,
      startDate: null,
      items: pageItems,
      totalItems: testData.length,
    }
  }

  res.send(body);
});

module.exports = router;
