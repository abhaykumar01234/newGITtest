//const dbconfig = require('./dbconfig.js');


module.exports={
    getConfiguration: function getConfiguration(req, res) {
        
        var d = globals.$.Deferred();
        globals.db.execute('getConfiguration')
            .done(function (result) {
                console.log(result);
                var _list = result.map(function (d) {
                    return d;
                });
                d.resolve(_list);
            })
            .fail(function (err) {
                d.reject(err);
            });

        return d.promise();
    }
}
