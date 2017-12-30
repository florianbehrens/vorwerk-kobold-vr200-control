const commandLineArgs = require('command-line-args')
const kobold = require('node-kobold');

const options = commandLineArgs([
  { name: 'credentials', alias: 'c', type: String },
  { name: 'command', type: String, defaultOption: true }
]);

[ email, password ] = options.credentials.split(':');

const client = new kobold.Client();

client.authorize(email, password, false, (error) => {
  if (error) {
    console.log(error);
    return;
  }

  client.getRobots((error, robots) => {
    if (error) {
      console.log(error);
      return;
    }
    if (robots.length) {
      const robot = robots[0];

      robot.getState((error, result) => {
        console.log(`Robot Vorwerk Kobold model ${result.meta.modelName} firmware version ${result.meta.firmware} available.`);

        try {
          robot[options.command]((error, result) => {
            if (error) {
              console.error(`Error occurred: ${error}`);
              return;
            }

            console.log(result);
          });
        } catch (ex) {
          console.error(`Invalid command: '${command}'`);
        }
      });
    } else {
      console.error("No robots found");
    }
  });
});
