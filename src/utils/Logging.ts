import chalk from 'chalk';

export default class Logging {

    public static log = (args: any) => this.info(args)

    public static info = (args: any) => console.log(chalk.blue(`[INFO] `), typeof args === 'string' ? chalk.blueBright(args) : args);

    public static warn = (args: any) => console.log(chalk.yellow(`[WARN] `), typeof args === 'string' ? chalk.yellowBright(args) : args);

    public static error = (args: any) => console.log(chalk.red(`[ERROR] `), typeof args === 'string' ? chalk.redBright(args) : args);

}