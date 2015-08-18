module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n*  VertebrateJS v <%= pkg.version %> by <%= pkg.author %>\n*  <%= pkg.homepage %>\n*/\n',
                mangle: false
            },
            build: {
                files: [{
                    src: 'vertebrate.js',
                    dest: 'vertebrate.min.js'
                }]
            }
        },
        concat: {
            options: {
                separator: ';\n',
                banner: '/**\n*  VertebrateJS v <%= pkg.version %> by <%= pkg.author %>\n*  <%= pkg.homepage %>\n*/\n',
            },
            build: {
                src: ['src/vertebrate.js'],
                dest: 'vertebrate.js'
            }
        },
        watch: {
            files: 'src/vertebrate.js',
            tasks: ['concat','uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat','uglify']);

};
