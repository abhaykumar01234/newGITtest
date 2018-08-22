function QueryDictionary(){
    this.dictionary={
        getConfiguration: {
			q: "select * from test_node",
			context: [""],
			descr: "provides sample data"
		}
    }
}

QueryDictionary.prototype.getQuery = function(q_code,params) {
    try {
        var str = this.dictionary[q_code].q;

        var reg = /::\w+::/ ,
            res = undefined;

        while((res = reg.exec(str))){
            str = str.replace(res[0], params[res[0].substring(2,res[0].length-2)]);
        }
        return str;
    } catch (error) {
        return null;
    }
}

module.exports = QueryDictionary;