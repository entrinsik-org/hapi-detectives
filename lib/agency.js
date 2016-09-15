'use strict';

var joi = require('joi');
var _ = require('lodash');
var P = require('bluebird');
var uuid = require('node-uuid');

var DriverManager = require('ent-drivers').DriverManager;

var internals = {};

internals.discover = function () {
    return [];
};

internals.isEligible = function () {
    return true;
};

internals.schema = {
    id: joi.string().default(() => uuid.v4(), 'default uuid'),
    isEligible: joi.func().default(internals.isEligible),
    discover: joi.func().default(internals.discover)
};

class Agency extends DriverManager {
    constructor() {
        super('detective', internals.schema);
    }

    discover(scope /**,  args **/) {
        var args = [].slice.call(arguments, 1);

        var detectives = this.all();

        function discover(detective) {
            return P.resolve(detective)
                .then(d => d.discover.apply(d, args))
                .then(values => _([]).concat(values).compact().value())
                .then(values => values.map((v, i) => _.assign({}, v, { id: `${detective.id}:${i}`, detective: detective.id })));
        }

        return P.filter(detectives, d => d.isEligible.apply(d, args))
            .then(builders => P.all(builders.map(d => discover(d))))
            .then(v => _(v)
                // [ null, [a, b], null, [ a, b] ] => [[a,b], [a, b]]
                    .compact()

                    // [[a,b], [a, b]] => [a, b, a, b]
                    .flatten()

                    .value()
            );
    }
}

exports.Agency = Agency;