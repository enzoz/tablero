/*
* Copyright 2014 Thoughtworks Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
define([
  'flight/lib/component'
  ],
  function (defineComponent) {
    'use strict';
    return defineComponent(columnsGateway);

    function columnsGateway() {
      this.showModal = function() {
        this.$node.modal({ backdrop: 'static', keyboard: false });
      };

      this.displayColumns = function(event, data) {
        var columns = _.sortBy(data.columns, function(column) {
          return Number(column['order']);
        });

        var columnsContainer = this.$node.find('.columns-container');
        _.each(columns, function(column){
          this.append('<li><input type="text" name="columns['+column.order+']" value="'+column.column+'"></li>');
        }, columnsContainer)
      };

      this.showColumnsModal = function() {
        $(document).trigger('ui:show:columnsModal');
        $(document).trigger('data:retrieve:columns');
      };

      this.setUp = function() {
        $('#changeColumns').click(this.showColumnsModal);
      };

      this.after('initialize', function () {
        this.setUp();
        this.on(document, 'ui:show:columnsModal', this.showModal.bind(this));
        this.on(document, 'data:got:columns', this.displayColumns.bind(this));
      });
    }
  });
