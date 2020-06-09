module.exports = {
    /**
     * generate function for sdk generator
     */
    generate: require('./lib/index').generate,

    /**
     * gives available options for sdk generator
     */
    getOptions: require('./lib/index').getOptions
};
