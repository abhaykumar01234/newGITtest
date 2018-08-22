function DBConnector(dictionary){
    this.oracleEnv = {
        dev : {
            user : "scott",
            password : "Tiger",
            connectString : "localhost/orcl64"
        }
    }

    var oraEnv = 'dev';

    this.oracleConf = this.oracleEnv[oraEnv];
    this.queryDictionary = dictionary;

    oracledb.createPool(this.oracleConf)
    .then((pool)=>{
        this.pool = pool;
    })
    .catch(function(err){
        console.error("DBConnection pool create error",err);
        d.reject(null);
    })
}

/*********************3 main functions*******************************/



DBConnector.prototype.execute = function (queryCode, params, formatter) {
    var d = globals.$.Deferred();
    if (queryCode === undefined)
        d.reject(null);
    else
        this.getPool()
            .done(conn => {
                this.executeQuery(conn.connection, queryCode, params, formatter)
                    .done(res => {
                        d.resolve(res);
                        this.closePool(conn);
                    })
                    .fail(err => {
                        d.reject(err);
                        this.closePool(conn);
                    })
            })
            .fail(err => d.reject(err));
    return d.promise();
};

DBConnector.prototype.executeQuery = function (conn, queryCode, params, formatter) {
    var that = this,
        d = globals.$.Deferred();
    //console.log('execute query=============\n',conn);
    var qry = that.queryDictionary.getQuery(queryCode, params);
    console.log(qry);
    if (qry == null) { console.log(queryCode) }
    var options = {},
        sub_qry = qry.trim().substring(0, 6).toUpperCase(),
        fetch;

    if (sub_qry.indexOf('SELECT') > -1) options = { resultSet: true };
    // console.log('qry', qry);
    conn.execute(qry, {}, options, function (err, result) {
        // console.log('result ', result);
        if (err) {
            console.error("_______ERROR EXEC DB QUERY { queryCode: " + queryCode + ", query: " + qry + " }");
            console.error("_______ERROR :", err, err.stack);
            err["query"] = qry;
            err["params"] = params;
            err["query_code"] = queryCode;
            d.reject(err);
            return d.promise();
        }
        //console.log('-------- ',qry +'--------------------'+ sub_qry);
        var allResults = [];
        if (sub_qry.indexOf('SELECT') > -1) {

            fetch = function (d, result) {
                var max = 300;
                result.resultSet.getRows(max, function (err, rows) {
                    if (err) {
                        console.error("error getRows[131]: ", err);
                        // conn.close();
                        d.reject(null);
                        return;
                    }

                    allResults = allResults.concat(rows);
                    // console.log('allResults', result.resultSet);
                    // console.log(rows.length);
                    if (rows.length === max) fetch(d, result);
                    else
                        result.resultSet.close(function (err) {
                            if (err) {
                                console.error("error close[140]: ", err);
                                // conn.close();
                                d.reject(null);
                                return;
                            }

                            // conn.close();
                            console.log("-- SUCCESS --")
                            d.resolve((formatter !== undefined) ? globals.functions.arrayObjectFormatter(allResults, formatter) : allResults);
                            return;
                        });
                })
            };
        } else {
            fetch = function (d, result) {
                d.resolve((formatter !== undefined) ? globals.functions.arrayObjectFormatter(result, formatter) : result);
            };
        }
        // console.log('******' , result);
        fetch(d, result);
    })
    return d.promise();
};

/*******************************helper functions ***************************/

DBConnector.prototype.getPool = function () {
    var d = globals.$.Deferred();
    //console.log("Connection pool getter")
    this.pool.getConnection(function (error, conn) {
        if (error) {
            console.error("error getConnection[169]: ", error);
            d.reject(error);
        }
        else
            d.resolve({ connection: conn });       
    });
    return d.promise();
};

DBConnector.prototype.closePool = function (obj) {
    try {
        console.log("POOL IN USE: ", this.pool.connectionsInUse, "POOL OPEN: ", this.pool.connectionsOpen)
        obj.connection.close();
        console.log("POOL IN USE: ", this.pool.connectionsInUse, "POOL OPEN: ", this.pool.connectionsOpen)
    } catch (e) {
        console.error("closePool[182]", e);
    }
}

function doClose(connection, resultSet) {
    resultSet.close(
        function (err) {
            if (err) { console.error(err.message+'===========================in do close'); }
            doRelease(connection);
        });
};
function doRelease(connection) {
    connection.close(
        function (err) {
            if (err) { console.error(err.message+'===========================in do release'); }
        });
};

module.exports = DBConnector;