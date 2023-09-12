// Servers
import { AutoInstall } from '@classes/autoinstall';

// Install the core tables
new AutoInstall().up().then(() => process.exit());