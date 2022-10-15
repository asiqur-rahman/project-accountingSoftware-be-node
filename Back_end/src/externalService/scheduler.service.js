const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 4)];
rule.hour = [new schedule.Range(10, 14, 1)];
rule.minute = [0];
rule.tz = this.timezone;

schedule.scheduleJob(rule, async function(){
  try {
    const shares = await sharePriceScraper();
    var selectedShareList=new Date().toLocaleString();
    var count=1;
    shares.forEach(share => {
      if(sharesForNotification.includes(share['TRADING CODE'])){
        selectedShareList+='\n';
        selectedShareList+=count++ +'.'+share['TRADING CODE']+'('+share['LTP']+','+share['HIGH']+','+share['LOW']+')';
      }
    });
    await sendSms(selectedShareList);
  } catch (err) {
    console.log(err);
  }
});

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// schedule.scheduleJob('0 43 10-14 * * 0-4', function(){
//   if(dailySmsSend<=dailySmsLimit){
//     // sendSms();
//     dailySmsSend++;
//   }
//   console.log('Today is recognized by Rebecca Black! '+new Date().toLocaleString());
// });
