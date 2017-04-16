var util = require("../util");
var config = require("../config");

var scoreCheckers = require("./scoreCheckers");

var scorebot = module.exports;
var scores = [];

scorebot.start = function() {
    config.teams.forEach(function(team) {
        scores.push(Object.assign({}, team, {
            score: 0,
            history: []
        }));
        scores.forEach(function (team) {
            team.computers.forEach(function (computer) {
                computer.services.forEach(function (service) {
                    service.consecutiveDown = 0;
                    service.currentlyUp = false;
                });
            });
        });
    });
    scorebot.check();
};

scorebot.check = function() {
    scores.forEach(function(team) {
        team.history.push(team.score);
        team.computers.forEach(function (computer) {
            computer.services.forEach(function (service) {
                var callback = function(result) {
                    if (result) {
                        team.score += config.scoreUpPoints;
                        service.consecutiveDown = 0;
                    } else {
                        service.consecutiveDown++;
                        if (service.consecutiveDown > config.scoreSLACounter) {
                            team.score += config.scoreSLAPoints;
                        } else {
                            team.score += config.scoreDownPoints;
                        }
                    }
                }
                if (scoreCheckers[service.type] === null) callback(true);
                else scoreCheckers[service.type](Object.assign({ name: computer.name }, service), callback);
            });
        });
    });
    setTimeout(scorebot.check, util.randomRange(1000*config.scoreIntervalMin, 1000*config.scoreIntervalMax));
}

scorebot.getScores = function() {
    return scores;
}