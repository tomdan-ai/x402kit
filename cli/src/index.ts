#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

const program = new Command();

program
    .name('x402kit')
    .description('Developer experience layer for x402-stacks')
    .version('0.1.0');

program
    .command('init')
    .description('Initialize a new x402kit project')
    .argument('[name]', 'Project name')
    .option('-t, --template <template>', 'Template to use (api or agent)', 'api')
    .action(async (name, options) => {
        let projectName = name;

        if (!projectName) {
            const response = await prompts({
                type: 'text',
                name: 'projectName',
                message: 'What is your project name?',
                initial: 'my-x402-project'
            });
            projectName = response.projectName;
        }

        const template = options.template;
        const projectPath = path.resolve(process.cwd(), projectName);

        if (fs.existsSync(projectPath)) {
            console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
            process.exit(1);
        }

        console.log(chalk.cyan(`Creating a new x402kit ${template} project in ${projectPath}...`));

        try {
            await fs.ensureDir(projectPath);

            // Simple scaffolding for now
            const packageJson = {
                name: projectName,
                version: '0.1.0',
                private: true,
                scripts: {
                    start: 'ts-node index.ts',
                    dev: 'ts-node-dev index.ts'
                },
                dependencies: {
                    'x402-stacks': 'latest',
                    '@x402kit/middleware': 'latest',
                    '@x402kit/agent-client': 'latest',
                    'express': '^4.18.2',
                    'axios': '^1.6.5'
                },
                devDependencies: {
                    'typescript': '^5.3.3',
                    'ts-node': '^10.9.2',
                    'ts-node-dev': '^2.0.0',
                    '@types/express': '^4.17.21',
                    '@types/node': '^20.11.0'
                }
            };

            await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

            let indexContent = '';
            if (template === 'api') {
                indexContent = `import express from 'express';
import { x402Paywall } from '@x402kit/middleware';

const app = express();
const port = 3000;

app.use(x402Paywall({
  prices: {
    '/data': '0.01 STX',
  },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Example address
  network: 'testnet'
}));

app.get('/data', (req, res) => {
  res.json({ message: 'This is paid data!' });
});

app.get('/', (req, res) => {
  res.send('Welcome to your x402kit API!');
});

app.listen(port, () => {
  console.log(\`API listening at http://localhost:\${port}\`);
});
`;
            } else {
                indexContent = `import { X402Agent } from '@x402kit/agent-client';
import { generateKeypair, privateKeyToAccount } from 'x402-stacks';

async function main() {
  // Generate a temporary account for demonstration
  const { privateKey } = generateKeypair('testnet');
  const account = privateKeyToAccount(privateKey, 'testnet');
  
  const agent = new X402Agent(account);

  console.log('Agent starting...');
  try {
    const data = await agent.call('http://localhost:3000/data');
    console.log('Response from paid API:', data);
  } catch (error) {
    console.error('Agent failed to call API:', error.message);
  }
}

main();
`;
            }

            await fs.writeFile(path.join(projectPath, 'index.ts'), indexContent);

            const tsconfig = {
                compilerOptions: {
                    target: "ESNext",
                    module: "CommonJS",
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true
                }
            };
            await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 });

            console.log(chalk.green('\nSuccess!'));
            console.log(chalk.white(`\nNext steps:\n  cd ${projectName}\n  npm install\n  npm start`));

        } catch (err) {
            console.error(chalk.red('Error creating project:'), err);
        }
    });

program.parse(process.argv);
