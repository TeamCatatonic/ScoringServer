
/*
 * GET home page.
 */

var scorebot = require("../scorebot");

exports.index = function(req, res){
  res.render('index', { scores: scorebot.getScores() })
};