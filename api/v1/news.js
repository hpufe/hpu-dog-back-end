var News = require('../../models/news');

var showList = function (req, res, next) {
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

    News.find({}, null, options, function (err, sres) {
      res.jsonp(sres);
    });
  } else {
    res.status(400).jsonp({
      err: 'params err!'
    });
  }
}

exports.showList = showList;

var showContent = function (req, res, next) {
  var id = req.params.id;

  if (id.length === 24 && new RegExp(/[a-z0-9]+/).test(id)) {

    News.findById(id, function (err, sres) {
      if (err) {
        return next(err);
      }
      res.jsonp(sres);
    });
  } else {
    res.status(400).jsonp({
      err: 'params err!'
    });
  }
}

exports.showContent = showContent;
