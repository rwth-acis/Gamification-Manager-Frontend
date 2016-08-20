'use strict';

module.exports = function (grunt) {

    // Project configuration.
    //noinspection JSUnusedGlobalSymbols
    var localConfig = grunt.file.readJSON('.localConfig.json');

    grunt.initConfig({

			pkg : grunt.file.readJSON('package.json'),
			baseUrl : localConfig.baseUrl,
			roleSandboxUrl : localConfig.roleSandboxUrl,
			endPointServiceURL : localConfig.endPointServiceURL,
            bowerdir : grunt.file.readJSON('.bowerrc')['directory'],
			distdir : 'dist',
			srcdir : 'src',

			clean : ["<%= distdir %>//*"],

			copy : {
				lib : {
					files : [
                        {
							src : '<%= bowerdir %>/bootstrap/dist/js/bootstrap.js',
							dest : '<%= distdir %>/js/lib/bootstrap.js'
						}, {
							src : '<%= bowerdir %>/bootstrap/dist/css/bootstrap.css',
							dest : '<%= distdir %>/css/bootstrap.css'
						}, {
                            cwd : '<%= bowerdir %>/bootstrap/fonts/',
                            expand : true,
                            src : ['**'],
                            dest : '<%= distdir %>/fonts/'
                        },{
							src : '<%= bowerdir %>/bootstrap/dist/css/bootstrap-theme.css',
							dest : '<%= distdir %>/css/bootstrap-theme.css'
						},{
							src : '<%= bowerdir %>/iwc/index.js',
							dest : '<%= distdir %>/js/lib/iwc.js'
						}, {
							src : '<%= bowerdir %>/jquery/jquery.js',
							dest : '<%= distdir %>/js/lib/jquery.js'
						}, {
							src : '<%= bowerdir %>/jquery.bootgrid/dist/jquery.bootgrid.js',
							dest : '<%= distdir %>/js/lib/jquery.bootgrid.js'
						},{
							src : '<%= bowerdir %>/jquery.bootgrid/dist/jquery.bootgrid.fa.js',
							dest : '<%= distdir %>/js/lib/jquery.bootgrid.fa.js'
						},{
							src : '<%= bowerdir %>/jquery.bootgrid/dist/jquery.bootgrid.css',
							dest : '<%= distdir %>/css/jquery.bootgrid.css'
						}, {
							src : '<%= bowerdir %>/lodash/dist/lodash.js',
							dest : '<%= distdir %>/js/lib/lodash.js'
						}
					]
				},
				main : {
					files : [{
							cwd : '<%= srcdir %>/',
							expand : true,
							src : ['**', '!widgets/**'],
							dest : '<%= distdir %>/'
						}
					],
                    options : {
                        processContent : function (content /*, srcpath*/
                        ) {
                            return grunt.template.process(content);
                        },
                        processContentExclude  : ['**/*.{png,gif,jpg}', '**/lodash.js']
                    }
				}
			},

			watch : {
				scripts : {
					files : ['**/*.js'],
					tasks : ['copy:main'],
					options : {
						spawn : false
					}
				},
				widgets : {
					files : ['**/*.xml', '**/*.tpl'],
					tasks : ['buildwidgets'],
					options : {
						spawn : false
					}
				}
			},

			buildwidgets : {
                options: {
                    partials: '<%= srcdir %>/widgets/partials'
                },

                application_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Application",
                                description: "",
                                width: "560",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_application_widget.tpl'
                        }
                    },
                    files: {
                        'dist/application.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                badge_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Badge",
                                description: "",
                                width: "800",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_badge_widget.tpl'
                        }
                    },
                    files: {
                        'dist/badge.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                point_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Point",
                                description: "",
                                width: "200",
                                height: "200"
                            },
                            bodyPartial: '_point_widget.tpl'
                        }
                    },
                    files: {
                        'dist/point.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                achievement_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Achievement",
                                description: "",
                                width: "970",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_achievement_widget.tpl'
                        }
                    },
                    files: {
                        'dist/achievement.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                level_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Level",
                                description: "",
                                width: "650",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_level_widget.tpl'
                        }
                    },
                    files: {
                        'dist/level.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                quest_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Quest",
                                description: "",
                                width: "800",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_quest_widget.tpl'
                        }
                    },
                    files: {
                        'dist/quest.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                },

                action_widget: {
                    options: {
                        data: {
                            meta: {
                                title: "Gamification Manager Action",
                                description: "",
                                width: "800",
                                height: "410",
                                table_height: "360",
                            },
                            bodyPartial: '_action_widget.tpl'
                        }
                    },
                    files: {
                        'dist/action.xml': ['<%= srcdir %>/widgets/widget.xml.tpl']
                    }
                }
            },
            jshint: {
                all: ['<%= srcdir %>/**/*.js','!<%= srcdir %>/js/lib/iwc.js']
            }

        });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('build', ['clean', 'copy:lib', 'copy:main', 'buildwidgets']);
    // grunt.registerTask('deploy', 'Deploy to dbis.rwth-aachen.de', function () {
    //     /*grunt.config.set('baseUrl', "http://dbis.rwth-aachen.de/~<%= sshconfig.dbis.username %>/syncmeta");*/
    //     grunt.config.set('roleSandboxUrl', "http://role-sandbox.eu");
    //     grunt.task.run(['clean', 'requirejs', 'copy:lib', 'copy:main', 'buildwidgets' /*,'sftp'*/
    //     ]);
    // });

    //grunt.registerTask('serve',['clean', 'requirejs', 'copy:lib', 'copy:main', 'buildwidgets','connect']);
};
