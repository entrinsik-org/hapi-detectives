'use strict';

const Agency = require('./agency').Agency;
const joi = require('joi');
const eu = require('ent-utils');

exports.Agency = Agency;

exports.register = function (server, opts, next) {
    joi.assert(opts, joi.func());

    server.route(function (route, opts) {
        return function(req, reply) {
            const agency = opts(req);

            agency.discover(req)
                .then(eu.collection)
                .nodeify(reply);
        };
    });

    next();
};