import qiniu from 'qiniu';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
  // code to run on server at startup
  // Listen to incoming HTTP requests, can only be used on the server
  WebApp.connectHandlers.use('/api/uptoken', (req, res) => {
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

  WebApp.connectHandlers.use('/api/move', (req, res) => {
    let body = '';
    const bucketName = Meteor.settings.private.qiniu.bucket;

    req.on('data', Meteor.bindEnvironment((data) => {
      body += data;
    }));

    req.on('end', Meteor.bindEnvironment(() => {
      console.log(body);
      body = JSON.parse(body);

      qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
      qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;

      const keys = body.entries;

      const client = new qiniu.rs.Client();

      const pairs = keys.map((key) => {
        const pathSrc = new qiniu.rs.EntryPath(bucketName, key.src);
        const pathDest = new qiniu.rs.EntryPath(bucketName, key.dest);

        const pair = new qiniu.rs.EntryPathPair(pathSrc, pathDest);
        return pair;
      });
      // const data = { pairs };
      // res.writeHead(200, { 'Content-Type': 'application/json' });
      // return res.end(JSON.stringify(data));
      client.batchMove(pairs, (err, rets) => {
        if (err) {
          throw new Meteor.Error(err);
        }
        console.log(rets, rets.length);
        const data = { rets };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(data));
      });
    }));
  });
});
