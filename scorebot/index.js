var util = require("../util");
var config = require("../config");

var scorebot = {};

var scores = [];

scorebot.start = function() {
    console.log("Started!");
    config.teams.forEach(function(team) {
        scores.push({
            name: team.name,
            ip: team.ip,
            score: 0,
            consecutiveDown: 0,
            history: []
        });
    });
    scorebot.check();
};

scorebot.check = function() {
    scores.forEach(function(item) {
        item.history.push(item.score);
        if (/* TODO: Eventually should check the score */ util.randomRange(0, 2) == 0) {
            item.score += config.scoreUpPoints;
            item.consecutiveDown = 0;
        } else {
            item.consecutiveDown++;
            if (item.consecutiveDown > config.scoreSLACounter) {
                item.score += config.scoreSLAPoints;
            } else {
                item.score += config.scoreDownPoints;
            }
        }
    });
    setTimeout(scorebot.check, util.randomRange(config.scoreIntervalMin, config.scoreIntervalMax));
}

scorebot.getScores = function() {
    return scores;
}

module.exports = scorebot;