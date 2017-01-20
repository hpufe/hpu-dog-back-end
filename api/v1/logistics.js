var logistics = require('../../models/logistics');

var show = function (req, res, next) {
  var limit = req.query.limit;
  var skip = req.query.skip;

  if (limit != '' && limit <= 100 && limit > 0) {
    var options = {
      limit: +limit,
      skip: skip === '' ? 0 : +skip,
      sort: {
        time: -1
      }
    };

    logistics.find({}, null, options, function (err, sres) {
      res.jsonp(sres);
    });
  } else {
    res.status(400).jsonp({
      err: 'params err!'
    });
  }
}

exports.show = show;
