import Vue from "vue";

Vue.filter('unslug', function (value) {
    if (!value) return '';
    value = value.replace(/_/g, ' ').toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    return value;
});

Vue.filter("dateFilter", function(val) {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY");
});

Vue.filter("stampTodateFilter", function(val) {
    return moment(val).format("DD-MM-YYYY");
});

