import { AutoInstall } from './autoinstall/classes/autoinstall';

// Install the core tables
new AutoInstall().up()
    .catch(error => process.exit(1))
    .then(() => process.exit());