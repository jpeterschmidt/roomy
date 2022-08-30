const { Construct } = require('constructs');
const { SPADeploy } = require('cdk-spa-deploy');

class RoomyFrontEnd extends Construct {
    constructor(scope) {
        super(scope, 'RoomyFrontEnd');
    
        new SPADeploy(scope, 'roomyFrontEndDeploy').createBasicSite({
          indexDoc: 'index.html',
          websiteFolder: '../client/public'
        })
      }
}

module.exports = { RoomyFrontEnd }