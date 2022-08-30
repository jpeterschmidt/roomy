const { Stack, Duration } = require('aws-cdk-lib');
const { RoomyFrontEnd } = require('./front-end-infrastructure');

class Roomy extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new RoomyFrontEnd(this)
  }
}

module.exports = { Roomy }
