module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n*  VertebrateJS v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n',
                mangle: false
            },
            build: {
                files: [{
                    src: 'vertebrate.js',
                    dest: 'vertebrate.min.js'
                }]
            }
        },
        watch: {
            files: 'vertebrate.js',
            tasks: ['uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify']);

};
