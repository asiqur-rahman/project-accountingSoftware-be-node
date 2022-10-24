/*
Template Name: BrainTechSolution
Author: BrainTechSolution
Website: https://braintechsolution.com/
Contact: braintechsoln@gmail.com
File: ecommerce cart Js File
*/

var defaultOptions = {
};

$('[data-toggle="touchspin"]').each(function (idx, obj) {
    var objOptions = $.extend({}, defaultOptions, $(obj).data());
    $(obj).TouchSpin(objOptions);
});