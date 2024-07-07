/**
 * author: Sang Do
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Constant = require("../common/constant.js");

const todoSchema = new Schema({
    id: String,
    title: String,
    is_active: { type: Boolean, default: true },
    created_time: { type: Number },  //millisecond
    category: String
});

const Todo = mongoose.model("todos", todoSchema);

//
Todo.prototype.find = function (
    condition,
    paging,
    fields,
    sort,
    resp_func   //callback function
) {
    Todo.find(condition)
        .limit(paging.limit)
        .skip(paging.skip)
        .select(fields)
        .sort(sort)
        .exec(function (err, res) {
            if (err) {
                var resp = {
                    result: Constant.FAILED_CODE,
                    message: Constant.SERVER_ERR,
                    name: err.name,
                    kind: err.kind,
                };
                resp_func(resp);
            } else {
                var resp = {
                    result: Constant.OK_CODE,
                    data: res,
                    skip: paging.skip,
                };
                resp_func(resp);
            }
        });
};

//create new document
Todo.prototype.create = function (data, resp_func) {
    var document = new Todo(data);
    document.save(function (err, result) {
        if (err) {
            var resp = {
                result: Constant.FAILED_CODE,
                message: Constant.SERVER_ERR,
                err: err,
            };
            resp_func(resp);
        } else {
            var resp = { result: Constant.OK_CODE, _id: result["_id"] };
            resp_func(resp);
        }
    });
};

//
Todo.prototype.update = function (existed_condition, update_data, resp_func) {
    var options = { upsert: false };
    Todo.updateOne(existed_condition, update_data, options, function (err, numAffected) {
        // numAffected is the number of updated documents
        if (err) {
            var resp = {
                result: Constant.FAILED_CODE,
                message: Constant.SERVER_ERR,
                err: err
            };
            resp_func(resp);
        } else {
            var resp = {
                result: Constant.OK_CODE
            };
            resp_func(resp);
        }
    });
};


// make this available to our users in our Node applications
module.exports = Todo;
