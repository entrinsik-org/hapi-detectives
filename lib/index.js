'use strict';

const Agency = require('./agency').Agency;
const joi = require('joi');
const eu = require('ent-utils');

exports.Agency = Agency;

exports.register = function (server, opts, next) {
    server.handler('discover', function (route, opts) {
        joi.assert(opts, joi.func());

        return function(req, reply) {
            const agency = opts(req);

            agency.discover(req)
                .then(eu.collection)
                .nodeify(reply);
        };
    });

    next();
};

exports.register.attributes = { name: 'ent-hapi-detectives' };