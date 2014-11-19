//xross.debug = true;

pythonz = {

    bootstrap: function() {
        xross.automate();
        $(function(){
            pythonz.mark_user();

            pythonz.make_cloud();
        });
    },

    make_cloud: function() {
        var max_ties = 0,
            font_size_min = 10,
            font_size_max = 35,
            $entries = $('.list_entry', '#tags_box');
            total = $entries.length;

        $entries.each(function(idx, item){
            var ties_num = $(item).data('tiesnum');
            if (ties_num > max_ties) {
                max_ties = ties_num;
            }
        });

        $entries.each(function(idx, item){
            var $item = $(item),
                ties_num = $item.data('tiesnum'),
                font_size = (font_size_max * ties_num) / max_ties;

            if (font_size < font_size_min) {
                font_size = font_size_min;
            }
            $item.css('font-size', font_size + 'px');
        });

    },

    mark_user: function() {
        $('.py_user').each(function(i, el) {
            var html = el.innerHTML.replace(/\[u:(\d+):\s*([^\]\s]+)\s*\]/g, '<a href="http://pythonz.net/users/$1" title="Профиль на pythonz">$2</a>');
            $(el).html(html);
        });
    },

    Reference: {

        RULE_PYVERSION_ADDED: [/\+py([\w\.]+)/g, '<small><div class="label label-info" title="Актуально с версии">$1</div></small>'],
        RULE_PYVERSION_REMOVED: [/-py([\w\.]+)/g, '<small><div class="label label-danger" title="Устрело в версии">$1</div></small>'],
        RULE_LITERAL: [/'([^']+)'/g, '<strong class="cl__green">$1</strong>'],
        RULE_UNDERMETHOD: [/(__[^\s]+__)/g, '<i>$1</i>'],
        RULE_BASE_TYPES: [
            /([^\w])(int|str|unicode|dict|tuple|list|set|iterable|callable|None|bool|True|False)([^\w])/g,
            '$1<small><code>$2</code></small>$3'
        ],
        RULE_EXCEPTIONS: [
            /([^\w])(KeyError|IndexError|ImportError|NotImplementedError|RuntimeError|StopIteration|SystemError|SyntaxError|TypeError|UnboundLocalError|ValueError)([^\w])/g,
            '$1<small><div class="label label-warning">$2</div></small>$3'
        ],
        RULE_EMDASH: [/\s+-\s+/g, ' &#8212; '],

        decorate_description: function(area_id) {
            this.decorate_area(area_id,
                [
                    this.RULE_PYVERSION_REMOVED,
                    this.RULE_PYVERSION_ADDED,
                    this.RULE_BASE_TYPES,
                    this.RULE_EXCEPTIONS,
                    this.RULE_EMDASH
                ]
            )
        },

        decorate_func_result: function(area_id) {
            this.decorate_area(area_id,
                [
                    this.RULE_PYVERSION_REMOVED,
                    this.RULE_PYVERSION_ADDED,
                    this.RULE_BASE_TYPES,
                    this.RULE_EMDASH
                ]
            )
        },

        decorate_func_params: function(area_id) {
            var func_process_args = function (match_str, arg_name, separator) {
                    arg_name = arg_name.replace(/([^=]+)(=.+)/g, '$1<span class="text-muted">$2</span>');
                    return '<small><span class="glyphicon glyphicon-certificate"></span></small> <b>' + arg_name + '</b>' + separator;
                };

            this.decorate_area(area_id,
                [
                    [/([^>\s]+)(\s--)/g, func_process_args],
                    [/--/g, ':'],
                    this.RULE_PYVERSION_REMOVED,
                    this.RULE_PYVERSION_ADDED,
                    this.RULE_LITERAL,
                    this.RULE_UNDERMETHOD,
                    this.RULE_BASE_TYPES,
                    this.RULE_EXCEPTIONS,
                    this.RULE_EMDASH
                ]
            )
        },

        decorate_area: function(area_id, rules) {
            var $area = $('#' + area_id),
                html = $area.html();

            if (html !== undefined) {
                $.each(rules, function (idx, rule) {
                    html = html.replace(rule[0], rule[1]);
                });
            }

            $area.html(html);

        }

    },

    Map: function (map_el_id, objects) {

        var self = this,
            _map_el = $('#'+map_el_id),
            _map_objs = objects;

        this.get_bounds_for_coords = function(coords) {
            return ymaps.util.bounds.getCenterAndZoom(coords, [_map_el.width(), _map_el.height()])
        };

        this.get_placemarks_from_map_objects = function(objects) {
            var all_marks = [],
                mark_idx = 0;

            if (objects===undefined) {
                objects = _map_objs
            }

            $.each(objects, function(id, props) {
                var coords = props.coords,
                    title = props.title,
                        descr = props.descr,
                        link = props.link;

                all_marks[mark_idx] = new ymaps.Placemark(coords, {
                        balloonContentHeader: title,
                        balloonContentBody: descr,
                        balloonContentFooter: link,
                        clusterCaption: title,
                        place_id: id
                    }, {
                        hideIconOnBalloonOpen: false,
                        preset: 'islands#darkBlueCircleDotIcon'
                    });

                mark_idx++;
            });
            return all_marks
        };

        this.get_clusterer = function() {
            var objs = self.get_placemarks_from_map_objects(),
                clusterer = new ymaps.Clusterer({
                    preset: 'islands#darkBlueClusterIcons',
                    clusterDisableClickZoom: true,
                    clusterBalloonPanelMaxMapArea: 0,
                    clusterBalloonContentLayoutWidth: 250,
                    clusterBalloonContentLayoutHeight: 100,
                    clusterBalloonLeftColumnWidth: 100
                });
            clusterer.add(objs);
            return clusterer;
        };

        this.init_map = function () {
            ymaps.ready(function () {
                var clusterer = self.get_clusterer(),
                    map_state = self.get_bounds_for_coords(clusterer.getBounds());

                $.extend(map_state, {
                    controls: ['zoomControl']
                });

                var map = new ymaps.Map(_map_el.attr('id'), map_state);
                map.geoObjects.add(clusterer);
            })
        };

        self.init_map();
    }

};

pythonz.bootstrap();
