const db = require('../models/model');
const StatusEnum = require('../utils/enum.utils');
const {appConfig}=require('../config/config');
const Op = require('sequelize').Op;
const fs = require('fs');
const path = require('path');

module.exports.adsIndex = async (req, res, next) => {
    await getAllAdsName().then((result)=>{
        res.locals = { title: 'Ads Index',allAds:result };
        res.render('Ads/tvAdsIndex',{layout: false});
    });
};

module.exports.adsShow = async (req, res, next) => {
    await getAdsFiles(req.params.adsName).then((result)=>{
        res.locals = { title: req.params.adsName.toUpperCase(),allAds:result };
        res.render('Ads/tvAdsShow',{layout: false});
    });
};

async function getAdsFiles(adsName){
    const filePath=path.join(__dirname, '..','..','public','tvAds',adsName);
    const srcPath=path.join('/public','tvAds',adsName)
    var files = fs.readdirSync(filePath);
    var count=1;
    var data=[];
    files.forEach(element => {
        data.push({id:count++,name:element,link:path.join(srcPath,element)})
    });
    return data;
}

async function getAllAdsName(){
    const foldersPath=path.join(__dirname, '..','..','public','tvAds');
    var folders = fs.readdirSync(foldersPath);
    var results=[];
    folders.forEach(element => {
        const downloadPath=path.join('/public','tvAds',element)
        // fs.readdir(downloadPath, (err, files) => {
        //     console.log(files);
        //   });
        if(fs.readdirSync(path.join(foldersPath,element)).length>0)
            results.push({name:element.toUpperCase(),adsLink:path.join('/tvAdsShow',element)});
    });
    return results;
}