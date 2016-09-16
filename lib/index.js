'use strict';

const Agency = require('./agency').Agency;
const joi = require('joi');
const eu = require('ent-utils');
const P = require('bluebird');

exports.Agency = Agency;

exports.register = function (server, opts, next) {
    server.handler('discover', function (route, opts) {
        joi.assert(opts, joi.func());

        return function(req, reply) {
            P.try(() => opts(req))
                .then(agency => agency.discover(req))
                .then(eu.collection)
                .nodeify(reply);
        };
    });

    next();
};

exports.register.attributes = { name: 'ent-hapi-detectives' };