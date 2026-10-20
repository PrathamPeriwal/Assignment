function write(stream: NodeJS.WriteStream, level: string, message: string) {
  stream.write(`${new Date().toISOString()} ${level} ${message}\n`);
}

export const logger = {
  info: (message: string) => write(process.stdout, 'INFO', message),
  error: (message: string) => write(process.stderr, 'ERROR', message),
};
