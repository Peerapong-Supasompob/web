/* License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */

odoo.define("web_decimal_numpad_dot.FieldFloat", function (require) {
    "use strict";

    var basic_fields = require("web.basic_fields");
    var translation = require("web.translation");

    var NumpadDotReplaceMixin = {
        init: function () {
            this.events = $.extend({}, this.events, {
                "keyup": "numpad_dot_replace",
            });
            return this._super.apply(this, arguments);
        },

        l10n_decimal_point: function () {
            return this.formatType === "float_time"
                ? ":" : translation._t.database.parameters.decimal_point;
        },

        _replaceAt: function (cur_val, index, replacement) {
            return cur_val.substr(0, index) + replacement +
                   cur_val.substr(index + replacement.length);
        },

        numpad_dot_replace: function (event) {
            // Only act on numpad dot key
            event.stopPropagation();
            if (event.keyCode !== 110) {
                return;
            }
            event.preventDefault();
            var from = this.$input.prop("selectionStart"),
                to = this.$input.prop("selectionEnd"),
                cur_val = this.$input.val(),
                point = this.l10n_decimal_point();
            var new_val = this._replaceAt(cur_val, from-1, point);
            this.$input.val(new_val);
            // Put user caret in place
            to = from + point.length;
            this.$input.prop("selectionStart", to).prop("selectionEnd", to);
        },
    };

    basic_fields.FieldFloat.include(NumpadDotReplaceMixin);
    basic_fields.FieldMonetary.include(NumpadDotReplaceMixin);

    return {
        NumpadDotReplaceMixin: NumpadDotReplaceMixin,
    };
});