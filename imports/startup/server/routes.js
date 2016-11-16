import qiniu from 'qiniu';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
  // code to run on server at startup
  // Listen to incoming HTTP requests, can only be used on the server
  WebApp.connectHandlers.use('/api/uptoken', (req, res) => {
    // We only care about POST methods
    // res.setHeader('Access-Control-Allow-Methods', 'POST');
    // I am running meteor as a backend, see https://iamlawrence.me/agnostic-meteor
    // Therefore we need to enable CORS
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let body = '';
    req.on('data', Meteor.bindEnvironment((data) => {
      body += data;
    }));

    req.on('end', Meteor.bindEnvironment(() => {
      body = JSON.parse(body);
      const bucket = Meteor.settings.private.qiniu.bucket;
      const key = `${body.user}/${body.collection}/`;
      qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
      qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;

      const putPolicy = new qiniu.rs.PutPolicy(bucket);

      const token = putPolicy.token();

      const data = {
        uptoken: token,
        key,
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }));
  });
});
